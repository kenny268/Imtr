const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      // Course belongs to Program
      Course.belongsTo(models.Program, {
        foreignKey: 'program_id',
        as: 'program'
      });

      // Course has many ClassSections
      Course.hasMany(models.ClassSection, {
        foreignKey: 'course_id',
        as: 'classSections'
      });

      // Note: Course can access Enrollments and Assessments through ClassSections
      // No direct association needed - use include in queries:
      // Course.findAll({ include: [{ model: ClassSection, include: [Enrollment, Assessment] }] })
    }
  }

  Course.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    program_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'programs',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        is: /^[A-Z]{3}\d{3}$/
      }
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [3, 255]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    credits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 10
      }
    },
    semester: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 8
      }
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 4
      }
    },
    course_type: {
      type: DataTypes.ENUM('core', 'elective', 'prerequisite', 'general'),
      allowNull: false,
      defaultValue: 'core'
    },
    prerequisites: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    learning_objectives: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    course_content: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    assessment_methods: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    textbooks: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    references: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'archived'),
      allowNull: false,
      defaultValue: 'active'
    },
    is_offered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    max_students: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    current_students: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    lecture_hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tutorial_hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    practical_hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    field_work_hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    total_hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    grading_system: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        assignments: 30,
        midterm: 20,
        final_exam: 50
      }
    },
    attendance_required: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    min_attendance_percentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 75
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    }
  }, {
    sequelize,
    modelName: 'Course',
    tableName: 'courses',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['code']
      },
      {
        fields: ['program_id']
      },
      {
        fields: ['semester']
      },
      {
        fields: ['year']
      },
      {
        fields: ['course_type']
      },
      {
        fields: ['status']
      }
    ],
    hooks: {
      beforeCreate: (course) => {
        // Calculate total hours
        course.total_hours = (course.lecture_hours || 0) + 
                           (course.tutorial_hours || 0) + 
                           (course.practical_hours || 0) + 
                           (course.field_work_hours || 0);
      },
      beforeUpdate: (course) => {
        // Calculate total hours
        course.total_hours = (course.lecture_hours || 0) + 
                           (course.tutorial_hours || 0) + 
                           (course.practical_hours || 0) + 
                           (course.field_work_hours || 0);
      }
    }
  });

  return Course;
};
