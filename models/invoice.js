'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Invoice extends Model {
        static associate(models) {
            Invoice.belongsTo(models.Rental, { foreignKey: 'rental_id' });
            Invoice.hasMany(models.invoiceDetail, { foreignKey: 'invoice_id' });
        }
    }

    Invoice.init({
        rental_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Rental',
                key: 'id'
            }
        },

        issue_date: {
            type: DataTypes.DATE,
            allowNull: false
        },

        total: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        status: {
            type: DataTypes.ENUM('pending','paid','canceled'),
            allowNull: false
        },

        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }

    }, {
        sequelize,
        modelName: 'Invoice',
        freezeTableName: true
    });

    return Invoice;
}
