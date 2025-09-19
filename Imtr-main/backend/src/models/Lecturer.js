const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Lecturer extends Model {
    static associate(models) {
      // Lecturer belongs to User
      Lecturer.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });

      // Lecturer has many ClassSections
      Lecturer.hasMany(models.ClassSection, {
        foreignKey: 'lecturer_id',
        as: 'classSections'
      });

      // Lecturer has many Assessments
      Lecturer.hasMany(models.Assessment, {
        foreignKey: 'lecturer_id',
        as: 'assessments'
      });

      // Lecturer can be a member of many ResearchProjects
      Lecturer.belongsToMany(models.ResearchProject, {
        through: models.ProjectMember,
        foreignKey: 'user_id',
        as: 'researchProjects'
      });

      // Lecturer can be a lead researcher in many ResearchProjects
      Lecturer.hasMany(models.ResearchProject, {
        foreignKey: 'lead_lecturer_id',
        as: 'ledResearchProjects'
      });

      // Lecturer can coordinate many Programs
      Lecturer.hasMany(models.Program, {
        foreignKey: 'coordinator_id',
        as: 'coordinatedPrograms'
      });
    }
  }

  Lecturer.init({
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
    staff_no: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        is: /^LEC\d{6}$/
      }
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    specialization: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    qualification: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    highest_degree: {
      type: DataTypes.ENUM('bachelor', 'master', 'phd', 'postdoc'),
      allowNull: true
    },
    institution: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    year_graduated: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1950,
        max: new Date().getFullYear()
      }
    },
    employment_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    employment_type: {
      type: DataTypes.ENUM('full_time', 'part_time', 'contract', 'visiting'),
      allowNull: false,
      defaultValue: 'full_time'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'on_leave', 'retired', 'terminated'),
      allowNull: false,
      defaultValue: 'active'
    },
    salary_scale: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    office_location: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    office_phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    office_hours: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    research_interests: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    publications: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    awards: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    certifications: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    languages: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    teaching_experience_years: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    industry_experience_years: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    supervisor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'lecturers',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    is_mentor: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    max_students: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 10
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
    modelName: 'Lecturer',
    tableName: 'lecturers',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id']
      },
      {
        unique: true,
        fields: ['staff_no']
      },
      {
        fields: ['department']
      },
      {
        fields: ['status']
      },
      {
        fields: ['employment_type']
      },
      {
        fields: ['supervisor_id']
      }
    ]
  });

  return Lecturer;
};
