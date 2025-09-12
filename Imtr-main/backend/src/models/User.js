const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // User has one Profile
      User.hasOne(models.Profile, {
        foreignKey: 'user_id',
        as: 'profile'
      });

      // User can be a Student
      User.hasOne(models.Student, {
        foreignKey: 'user_id',
        as: 'student'
      });

      // User can be a Lecturer
      User.hasOne(models.Lecturer, {
        foreignKey: 'user_id',
        as: 'lecturer'
      });

      // User can have many Notifications
      User.hasMany(models.Notification, {
        foreignKey: 'user_id',
        as: 'notifications'
      });

      // User can have many AuditLogs (as actor)
      User.hasMany(models.AuditLog, {
        foreignKey: 'actor_user_id',
        as: 'auditLogs'
      });

      // User can be a member of many ResearchProjects
      User.belongsToMany(models.ResearchProject, {
        through: models.ProjectMember,
        foreignKey: 'user_id',
        as: 'researchProjects'
      });

      // User can have many Loans
      User.hasMany(models.Loan, {
        foreignKey: 'borrower_user_id',
        as: 'loans'
      });
    }
  }

  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'LECTURER', 'STUDENT', 'FINANCE', 'LIBRARIAN', 'IT'),
      allowNull: false,
      defaultValue: 'STUDENT'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended', 'pending'),
      allowNull: false,
      defaultValue: 'pending'
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    email_verification_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    password_reset_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    password_reset_expires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    login_attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    locked_until: {
      type: DataTypes.DATE,
      allowNull: true
    },
    two_factor_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    two_factor_secret: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    preferences: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['email']
      },
      {
        fields: ['role']
      },
      {
        fields: ['status']
      },
      {
        fields: ['email_verification_token']
      },
      {
        fields: ['password_reset_token']
      }
    ],
    hooks: {
      beforeCreate: (user) => {
        // Ensure email is lowercase
        if (user.email) {
          user.email = user.email.toLowerCase();
        }
      },
      beforeUpdate: (user) => {
        // Ensure email is lowercase
        if (user.email) {
          user.email = user.email.toLowerCase();
        }
      }
    }
  });

  return User;
};
