const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    static associate(models) {
      // Profile belongs to User
      Profile.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }

  Profile.init({
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
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100]
      }
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100]
      }
    },
    middle_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: /^(\+254|0)[17]\d{8}$/
      }
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    county: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    postal_code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    national_id: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
      validate: {
        is: /^\d{8}$/
      }
    },
    passport_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    },
    profile_picture: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    emergency_contact_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    emergency_contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    emergency_contact_relationship: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    linkedin: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    twitter: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    }
  }, {
    sequelize,
    modelName: 'Profile',
    tableName: 'profiles',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id']
      },
      {
        unique: true,
        fields: ['national_id']
      },
      {
        unique: true,
        fields: ['passport_number']
      },
      {
        fields: ['phone']
      },
      {
        fields: ['gender']
      },
      {
        fields: ['county']
      }
    ],
    hooks: {
      beforeCreate: (profile) => {
        // Format phone number
        if (profile.phone) {
          profile.phone = profile.phone.replace(/\s+/g, '');
        }
      },
      beforeUpdate: (profile) => {
        // Format phone number
        if (profile.phone) {
          profile.phone = profile.phone.replace(/\s+/g, '');
        }
      }
    }
  });

  return Profile;
};
