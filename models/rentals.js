'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Rental extends Model {
        static associate(models) {
            Rental.belongsTo(models.User, { foreignKey: 'user_id' });
            Rental.belongsTo(models.Car, { foreignKey: 'car_id' });

            Rental.hasMany(models.Invoice, { foreignKey: 'rental_id' });
        }
    }

    Rental.init({
        car_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        start_date: {
            type: DataTypes.DATE,
            allowNull: false
        },

        completion_date: {
            type: DataTypes.DATE,
            allowNull: false
        },

        daily_rate: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        total: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        observation: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }

    }, {
        sequelize,
        modelName: 'Rental',
        freezeTableName: true
    });

    return Rental;
}
