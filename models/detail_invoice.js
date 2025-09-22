'use strict';


const {
Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
    class invoiceDetail extends Model {
        static associate(models) {
            invoiceDetail.belongsTo(models.Invoice, { foreignKey: 'invoice_id' });
        }
    }

    invoiceDetail.init({
        invoice_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'INvoice',
              key: 'id',
            },
        },

        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        unit_price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        subtotal: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }

    }, {
        sequelize,
        modelName: 'invoiceDetail'
    });


    return invoiceDetail
}