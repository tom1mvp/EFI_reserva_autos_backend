'use strict';


const {
Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.belongsTo(models.People, { foreignKey: 'people_id' });
            User.hasMany(models.Rental, { foreignKey: 'user_id' });
            User.hasMany(models.Payment, { foreignKey: 'user_id' });
        }
    }

    User.init({

        people_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'People',
              key: 'id',
            },
        },

        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        role : {
            type: DataTypes.ENUM('admin', 'customer'),
            allowNull: false,
            defaultValue: 'customer'
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        mail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },

        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'User',
        freezeTableName: true
    });

    return User;
}