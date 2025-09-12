const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ClassSection extends Model {
    static associate(models) {
      // ClassSection belongs to Course
      ClassSection.belongsTo(models.Course, {
        foreignKey: 'course_id',
        as: 'course'
      });

      // ClassSection belongs to Lecturer
      ClassSection.belongsTo(models.Lecturer, {
        foreignKey: 'lecturer_id',
        as: 'lecturer'
      });

      // ClassSection has many Enrollments
      ClassSection.hasMany(models.Enrollment, {
        foreignKey: 'class_section_id',
        as: 'enrollments'
      });

      // ClassSection has many Attendances
      ClassSection.hasMany(models.Attendance, {
        foreignKey: 'class_section_id',
        as: 'attendances'
      });

      // ClassSection has many Assessments
      ClassSection.hasMany(models.Assessment, {
        foreignKey: 'class_section_id',
        as: 'assessments'
      });
    }
  }

  ClassSection.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    lecturer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'lecturers',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    section_code: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    room: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    building: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30
    },
    current_enrollment: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    schedule: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {}
    },
    academic_year: {
      type: DataTypes.STRING(9),
      allowNull: false,
      validate: {
        is: /^\d{4}-\d{4}$/
      }
    },
    semester: {
      type: DataTypes.ENUM('1', '2', '3'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'ongoing', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'scheduled'
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    registration_deadline: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    drop_deadline: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    grading_deadline: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    is_online: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    online_platform: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    online_link: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    }
  }, {
    sequelize,
    modelName: 'ClassSection',
    tableName: 'class_sections',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['course_id']
      },
      {
        fields: ['lecturer_id']
      },
      {
        fields: ['academic_year']
      },
      {
        fields: ['semester']
      },
      {
        fields: ['status']
      },
      {
        fields: ['start_date']
      },
      {
        fields: ['end_date']
      }
    ],
    validate: {
      endDateAfterStartDate() {
        if (this.end_date && this.start_date && this.end_date < this.start_date) {
          throw new Error('End date must be after start date');
        }
      },
      enrollmentWithinCapacity() {
        if (this.current_enrollment > this.capacity) {
          throw new Error('Current enrollment cannot exceed capacity');
        }
      }
    }
  });

  return ClassSection;
};
