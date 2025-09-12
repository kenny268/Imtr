const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    static associate(models) {
      // Student belongs to User
      Student.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });

      // Student belongs to Program
      Student.belongsTo(models.Program, {
        foreignKey: 'program_id',
        as: 'program'
      });

      // Student has many Enrollments
      Student.hasMany(models.Enrollment, {
        foreignKey: 'student_id',
        as: 'enrollments'
      });

      // Student has many Attendances
      Student.hasMany(models.Attendance, {
        foreignKey: 'student_id',
        as: 'attendances'
      });

      // Student has many Grades
      Student.hasMany(models.Grade, {
        foreignKey: 'student_id',
        as: 'grades'
      });

      // Student has many Invoices
      Student.hasMany(models.Invoice, {
        foreignKey: 'student_id',
        as: 'invoices'
      });

      // Student can be a member of many ResearchProjects
      Student.belongsToMany(models.ResearchProject, {
        through: models.ProjectMember,
        foreignKey: 'user_id',
        as: 'researchProjects'
      });

      // Student has many Loans
      Student.hasMany(models.Loan, {
        foreignKey: 'borrower_user_id',
        as: 'loans'
      });
    }
  }

  Student.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    student_no: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        is: /^STU\d{6}$/
      }
    },
    admission_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    program_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'programs',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'graduated', 'suspended', 'withdrawn'),
      allowNull: false,
      defaultValue: 'active'
    },
    enrollment_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 2020,
        max: 2030
      }
    },
    expected_graduation_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    actual_graduation_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    gpa: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      validate: {
        min: 0.00,
        max: 4.00
      }
    },
    cgpa: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      validate: {
        min: 0.00,
        max: 4.00
      }
    },
    total_credits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    completed_credits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    scholarship_type: {
      type: DataTypes.ENUM('none', 'merit', 'need_based', 'sports', 'research', 'government'),
      allowNull: false,
      defaultValue: 'none'
    },
    scholarship_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    sponsor_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    sponsor_contact: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    parent_guardian_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    parent_guardian_phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    parent_guardian_email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    parent_guardian_relationship: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    previous_school: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    previous_qualification: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    previous_gpa: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      validate: {
        min: 0.00,
        max: 4.00
      }
    },
    clearance_status: {
      type: DataTypes.ENUM('pending', 'partial', 'complete'),
      allowNull: false,
      defaultValue: 'pending'
    },
    clearance_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    exam_card_issued: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    exam_card_number: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    transcript_issued: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    transcript_number: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    certificate_issued: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    certificate_number: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    }
  }, {
    sequelize,
    modelName: 'Student',
    tableName: 'students',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id']
      },
      {
        unique: true,
        fields: ['student_no']
      },
      {
        fields: ['program_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['enrollment_year']
      },
      {
        fields: ['admission_date']
      },
      {
        fields: ['exam_card_number']
      },
      {
        fields: ['transcript_number']
      },
      {
        fields: ['certificate_number']
      }
    ],
    hooks: {
      beforeCreate: (student) => {
        // Set expected graduation date based on program duration
        if (student.admission_date && !student.expected_graduation_date) {
          const admissionDate = new Date(student.admission_date);
          const expectedGraduation = new Date(admissionDate);
          expectedGraduation.setFullYear(admissionDate.getFullYear() + 4); // Default 4 years
          student.expected_graduation_date = expectedGraduation;
        }
      }
    }
  });

  return Student;
};
