'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class People extends Model {
    static associate(models) {
      People.hasMany(models.User, { foreignKey: 'people_id' });
    }
  }

  People.init({
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    age: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    gender: { 
        type: DataTypes.ENUM('female','male','other'), 
        allowNull: false 
    },
    birthday: { 
        type: DataTypes.DATEONLY, 
        allowNull: false 
    },
    dni: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    phone: { 
        type: DataTypes.STRING, 
        allowNull: false 
    }
  }, {
    sequelize,
    modelName: 'People',
  });

  return People;
};