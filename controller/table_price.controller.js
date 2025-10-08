const { PriceTable } = require('../models');

const getAllPriceTable = async (req, res) => {
    try {
        const table_price = await PriceTable.findAll();

        res.json({ status: 200, data: table_price });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al obtener las personas', error: error.message });
    }
}

const createPriceTable = async (req, res) => {
    const { name, price, category } = req.body;

    try {
        if( !name || !price || !category) {
            return res.status(400).json({ status: 400, message: 'Faltan campos obligatorios' });
        }

       const new_price_table = await PriceTable.create({
            name, 
            price, 
            category
       });

       res.status(201).json({ status: 201, message: 'Elemento creado con éxito', data: new_price_table });

    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al crear el elemento', error: error.message });
    }
}


const updatePriceTable = async (req, res) => {
    const priceTable = await PriceTable.findByPk(req.params.id);

    if(!priceTable) {
        return res.status(404).json({ status: 404, message: 'Elemento no encontrado'});
    }

    const { name, price, category } = req.body;

    priceTable.name = name || priceTable,name;
    priceTable.price = price || priceTable.price;
    priceTable.category = category || priceTable.category;
}

module.exports = {
    getAllPriceTable,
    createPriceTable,
    updatePriceTable
}