const { Payment } = require('../models');
const { createInvoiceLogic } = require('../controller/invoice.controller');

const getAllPayment = async (req, res) => {
    try{
        const payment = Payment.findAll();

       return res.status(200).json({ status: 200, data: payment });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error al buscar los pagos', error: error.message });
    }
}

const createPayment = async (req, res) => {
    try {
        const { rental_id, payment_date, amount, payment_method, status, details } = req.body;

        if (!rental_id || !payment_date || !amount || !payment_method || !status) {
            return res.status(400).json({ status: 400, message: 'Faltan campos obligatorios' });
        }

        const invoice = await createInvoiceLogic({
            rental_id,
            issue_date: payment_date,
            status: 'paid',
            details
        });

        const new_payment = await Payment.create({
            invoice_id: invoice.id,
            payment_date,
            amount,
            payment_method,
            status,
            is_active: true
        });

        return res.status(201).json({
            status: 201,
            message: 'Pago y factura creados con éxito',
            data: { payment: new_payment, invoice }
        });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error al crear el pago y la factura', error: error.message });
    }
};


module.exports = {
    getAllPayment,
    createPayment
}