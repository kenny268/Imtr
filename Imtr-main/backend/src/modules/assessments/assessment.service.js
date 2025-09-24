const { Assessment, ClassSection, Lecturer, Course, Program, Student, Grade, User, Profile } = require('../../models');
const { AppError } = require('../../utils/errorHandler');
const { Op } = require('sequelize');

class AssessmentService {
  // Create a new assessment
  async createAssessment(assessmentData, userId) {
    try {
      // Verify class section exists and lecturer has access
      const classSection = await ClassSection.findByPk(assessmentData.class_section_id, {
        include: [
          { model: Course, as: 'course' },
          { model: Lecturer, as: 'lecturer' }
        ]
      });

      if (!classSection) {
        throw new AppError('Class section not found', 404);
      }

      // Verify lecturer has access to this class section
      if (classSection.lecturer_id !== assessmentData.lecturer_id) {
        throw new AppError('Lecturer does not have access to this class section', 403);
      }

      const assessment = await Assessment.create(assessmentData);
      return await this.getAssessmentById(assessment.id);
    } catch (error) {
      throw error;
    }
  }

  // Get all assessments with pagination and filters
  async getAssessments(queryParams) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      type,
      status,
      class_section_id,
      lecturer_id,
      academic_year,
      semester
    } = queryParams;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { instructions: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Filter by type
    if (type) {
      whereClause.type = type;
    }

    // Filter by status
    if (status) {
      whereClause.status = status;
    }

    // Filter by class section
    if (class_section_id) {
      whereClause.class_section_id = class_section_id;
    }

    // Filter by lecturer
    if (lecturer_id) {
      whereClause.lecturer_id = lecturer_id;
    }

    // Filter by academic year and semester
    if (academic_year || semester) {
      const classSectionWhere = {};
      if (academic_year) classSectionWhere.academic_year = academic_year;
      if (semester) classSectionWhere.semester = semester;
      
      whereClause.class_section_id = {
        [Op.in]: await ClassSection.findAll({
          where: classSectionWhere,
          attributes: ['id']
        }).then(sections => sections.map(s => s.id))
      };
    }

    const { count, rows: assessments } = await Assessment.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: ClassSection,
          as: 'classSection',
          attributes: ['id', 'section_code', 'academic_year', 'semester', 'status'],
          include: [
            {
              model: Course,
              as: 'course',
              attributes: ['id', 'title', 'code', 'credits'],
              include: [
                {
                  model: Program,
                  as: 'program',
                  attributes: ['id', 'name', 'code', 'level']
                }
              ]
            },
            {
              model: Lecturer,
              as: 'lecturer',
              attributes: ['id', 'staff_no'],
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['id', 'email'],
                  include: [
                    {
                      model: Profile,
                      as: 'profile',
                      attributes: ['first_name', 'last_name']
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return {
      assessments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    };
  }

  // Get assessment by ID
  async getAssessmentById(id) {
    const assessment = await Assessment.findByPk(id, {
      include: [
        {
          model: ClassSection,
          as: 'classSection',
          attributes: ['id', 'section_code', 'academic_year', 'semester', 'status', 'room', 'building'],
          include: [
            {
              model: Course,
              as: 'course',
              attributes: ['id', 'title', 'code', 'credits', 'description'],
              include: [
                {
                  model: Program,
                  as: 'program',
                  attributes: ['id', 'name', 'code', 'level']
                }
              ]
            },
            {
              model: Lecturer,
              as: 'lecturer',
              attributes: ['id', 'staff_no'],
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['id', 'email'],
                  include: [
                    {
                      model: Profile,
                      as: 'profile',
                      attributes: ['first_name', 'last_name']
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          model: Grade,
          as: 'grades',
          attributes: ['id', 'student_id', 'score', 'letter_grade', 'graded_at', 'comments'],
          include: [
            {
              model: Student,
              as: 'student',
              attributes: ['id', 'student_no'],
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['id', 'email'],
                  include: [
                    {
                      model: Profile,
                      as: 'profile',
                      attributes: ['first_name', 'last_name']
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    if (!assessment) {
      throw new AppError('Assessment not found', 404);
    }

    return assessment;
  }

  // Update assessment
  async updateAssessment(id, updateData, userId) {
    try {
      const assessment = await Assessment.findByPk(id);
      if (!assessment) {
        throw new AppError('Assessment not found', 404);
      }

      // Check if assessment can be updated (not completed)
      if (assessment.status === 'completed') {
        throw new AppError('Cannot update completed assessment', 400);
      }

      await assessment.update(updateData);
      return await this.getAssessmentById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete assessment
  async deleteAssessment(id, userId) {
    try {
      const assessment = await Assessment.findByPk(id);
      if (!assessment) {
        throw new AppError('Assessment not found', 404);
      }

      // Check if assessment can be deleted (not published)
      if (assessment.status === 'published' || assessment.status === 'grading' || assessment.status === 'completed') {
        throw new AppError('Cannot delete published or completed assessment', 400);
      }

      await assessment.destroy();
      return { message: 'Assessment deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Publish assessment
  async publishAssessment(id, publishData, userId) {
    try {
      const assessment = await Assessment.findByPk(id);
      if (!assessment) {
        throw new AppError('Assessment not found', 404);
      }

      if (assessment.status !== 'draft') {
        throw new AppError('Only draft assessments can be published', 400);
      }

      const updateData = {
        status: 'published',
        ...publishData
      };

      await assessment.update(updateData);
      return await this.getAssessmentById(id);
    } catch (error) {
      throw error;
    }
  }

  // Grade assessment
  async gradeAssessment(assessmentId, gradeData, userId) {
    try {
      const assessment = await Assessment.findByPk(assessmentId);
      if (!assessment) {
        throw new AppError('Assessment not found', 404);
      }

      if (assessment.status !== 'published' && assessment.status !== 'grading') {
        throw new AppError('Assessment must be published to accept grades', 400);
      }

      // Check if student is enrolled in the class section
      const enrollment = await require('../../models').Enrollment.findOne({
        where: {
          student_id: gradeData.student_id,
          class_section_id: assessment.class_section_id,
          status: 'enrolled'
        }
      });

      if (!enrollment) {
        throw new AppError('Student is not enrolled in this class section', 400);
      }

      // Validate score
      if (gradeData.score > assessment.max_score) {
        throw new AppError('Score cannot exceed maximum score', 400);
      }

      // Create or update grade
      const [grade, created] = await Grade.findOrCreate({
        where: {
          assessment_id: assessmentId,
          student_id: gradeData.student_id
        },
        defaults: {
          ...gradeData,
          graded_by: userId,
          graded_at: new Date()
        }
      });

      if (!created) {
        await grade.update({
          ...gradeData,
          graded_by: userId,
          graded_at: new Date()
        });
      }

      // Update assessment status to grading if not already
      if (assessment.status === 'published') {
        await assessment.update({ status: 'grading' });
      }

      return await this.getAssessmentById(assessmentId);
    } catch (error) {
      throw error;
    }
  }

  // Get student grades for an assessment
  async getStudentGrades(assessmentId) {
    try {
      const assessment = await Assessment.findByPk(assessmentId, {
        include: [
          {
            model: ClassSection,
            as: 'classSection',
            attributes: ['id', 'section_code']
          }
        ]
      });

      if (!assessment) {
        throw new AppError('Assessment not found', 404);
      }

      const grades = await Grade.findAll({
        where: { assessment_id: assessmentId },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'student_no'],
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'email'],
                include: [
                  {
                    model: Profile,
                    as: 'profile',
                    attributes: ['first_name', 'last_name']
                  }
                ]
              }
            ]
          }
        ],
        order: [['student', 'student_no', 'ASC']]
      });

      return {
        assessment,
        grades
      };
    } catch (error) {
      throw error;
    }
  }

  // Get assessment statistics
  async getAssessmentStatistics(queryParams) {
    const { academic_year, semester, lecturer_id, type } = queryParams;
    
    const whereClause = {};
    if (academic_year) whereClause.academic_year = academic_year;
    if (semester) whereClause.semester = semester;
    if (lecturer_id) whereClause.lecturer_id = lecturer_id;
    if (type) whereClause.type = type;

    const stats = await Assessment.findAll({
      where: whereClause,
      attributes: [
        'type',
        'status',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['type', 'status'],
      raw: true
    });

    return stats;
  }

  // Get assessment options for dropdowns
  async getAssessmentOptions() {
    const types = ['assignment', 'quiz', 'midterm', 'final', 'project', 'presentation', 'lab'];
    const statuses = ['draft', 'published', 'grading', 'completed'];

    return {
      types,
      statuses
    };
  }
}

module.exports = new AssessmentService();
