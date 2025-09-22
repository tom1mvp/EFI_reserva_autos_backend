'use strict';


const {
Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
    class Rentals extends Model {
        static associate(models) {
            Rentals.belongsTo(models.User, { foreignKey: 'user_id' });
            Rentals.belongsTo(models.Car, { foreignKey: 'car_id' });

            Rentals.hasMany(models.Invoice, { foreignKey: 'rental_id' })
        }
    }

    Rentals.init({
        car_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'Car',
              key: 'id',
            },
        },

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'User',
              key: 'id',
            },
        },

        start_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        completion_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        daily_rate: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        total: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        observation: {
            type: DataTypes.TEXT,
            allowNull: false,
        },


        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'Rental'
    });

    return Rentals
}