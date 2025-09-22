'use strict';


const {
Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
    class Car extends Model {
        static associate(models) {
            Car.hasMany(models.Rental, { foreignKey: 'car_id' });
        }
    }

    Car.init({
        brand: {
            type: DataTypes.STRING, 
            allowNull: false, 
        },

        model: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        color: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        age: {
            type: DataTypes.STRING,
            allowNull: false
        },

        price_day: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },

        availble: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },

        stock: {
            type: DataTypes.DECIMAL,
            allowNull: false
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
        modelName: 'Car'
    });

    return Car
}