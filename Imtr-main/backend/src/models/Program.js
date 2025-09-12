const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Program extends Model {
    static associate(models) {
      // Program has many Students
      Program.hasMany(models.Student, {
        foreignKey: 'program_id',
        as: 'students'
      });

      // Program has many Courses
      Program.hasMany(models.Course, {
        foreignKey: 'program_id',
        as: 'courses'
      });

      // Program has many FeeStructures
      Program.hasMany(models.FeeStructure, {
        foreignKey: 'program_id',
        as: 'feeStructures'
      });
    }
  }

  Program.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [3, 255]
      }
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        len: [2, 20]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    level: {
      type: DataTypes.ENUM('certificate', 'diploma', 'bachelor', 'master', 'phd', 'postdoc'),
      allowNull: false
    },
    duration_months: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 120
      }
    },
    total_credits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 200
      }
    },
    min_credits_per_semester: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 12
    },
    max_credits_per_semester: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 18
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    faculty: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    coordinator_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'lecturers',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended', 'archived'),
      allowNull: false,
      defaultValue: 'active'
    },
    accreditation_body: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    accreditation_number: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    accreditation_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    accreditation_expiry: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    entry_requirements: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    learning_outcomes: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    career_prospects: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    tuition_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    registration_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    examination_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    library_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    laboratory_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    other_fees: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    application_deadline: {
      type: DataTypes.DATEONLY,
      allowNull: true
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
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    }
  }, {
    sequelize,
    modelName: 'Program',
    tableName: 'programs',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['code']
      },
      {
        fields: ['level']
      },
      {
        fields: ['status']
      },
      {
        fields: ['department']
      },
      {
        fields: ['faculty']
      },
      {
        fields: ['coordinator_id']
      }
    ]
  });

  return Program;
};
