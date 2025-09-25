'use strict';


const {
Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
    class PriceTable extends Model {
        static associate(models) {
            PriceTable.hasMany(models.invoiceDetail, { foreignKey: 'price_table_id' });
        }
    }

    PriceTable.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        category: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'PriceTable'
    });

    return PriceTable
}