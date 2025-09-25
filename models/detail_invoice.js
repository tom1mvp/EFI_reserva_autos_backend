'use strict';


const {
Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
    class invoiceDetail extends Model {
        static associate(models) {
            invoiceDetail.belongsTo(models.Invoice, { foreignKey: 'invoice_id' });

            invoiceDetail.belongsTo(models.PriceTable, { foreignKey: 'price_table_id' });
        }
    }

    invoiceDetail.init({
        invoice_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'Invoice',
              key: 'id',
            },
        },

        price_table_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'PriceTable',
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