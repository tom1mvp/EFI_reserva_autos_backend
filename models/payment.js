'use strict';


const {
Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
    class Payment extends Model {
        static associate(models) {
            Payment.belongsTo(models.Invoice, { foreignKey: 'invoice_id' });
        }
    }

    Payment.init({
        invoice_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'Invoice',
              key: 'id',
            },
        },

        payment_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        payment_method: {
            type: DataTypes.STRING, 
        allowNull: false 
        },

        status: {
            type: DataTypes.ENUM('pending','paid'), 
            allowNull: false
        },

        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }

    }, {
        sequelize,
        modelName: 'Payment',
        freezeTableName: true
    });

    return Payment
}