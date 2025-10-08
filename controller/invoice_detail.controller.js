const { invoiceDetail } = require('../models');


const getAllDetail = async (req, res) => {
    try {
        const detail_invoice = invoiceDetail.findAll();

        res.status(200).json({ status: 200, data: detail_invoice });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'No error al obtener los detalles de factura'});
    }
}


module.exports = {
    getAllDetail,
}