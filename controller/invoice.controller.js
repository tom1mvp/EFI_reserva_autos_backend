const { Invoice, invoiceDetail, PriceTable, Rental } = require('../models');

const createDetailForInvoice = async (invoice_id, price_table_id, quantity) => {
    const price_table = await PriceTable.findByPk(price_table_id);
    if (!price_table) {
        throw new Error('No se encontró el precio en la tabla de precios');
    }

    const unit_price = price_table.price;
    const subtotal = unit_price * quantity;

    const new_detail = await invoiceDetail.create({
        invoice_id,
        price_table_id,
        quantity,
        unit_price,
        subtotal
    });

    return new_detail;
};

const createInvoiceLogic = async ({ rental_id, issue_date, status, details }) => {
    const rental = await Rental.findByPk(rental_id);
    if (!rental) {
        throw new Error('No se puede crear una factura para una renta que no existe.');
    }

    const start = new Date(rental.start_date);
    const end = new Date(rental.completion_date);
    const quantity_days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (!details?.length) {
        throw new Error('No se proporcionaron detalles de la factura');
    }

    const invoice = await Invoice.create({
        rental_id,
        issue_date,
        status,
        total: 0,
        is_active: true
    });

    let total = 0;
    for (const item of details) {
        const new_detail = await createDetailForInvoice(invoice.id, item.price_table_id, quantity_days);
        total += new_detail.subtotal;
    }

    invoice.total = total;
    await invoice.save();

    return invoice;
};

const getAllInvoice = async (req, res) => {
    try {
        const invoices = await Invoice.findAll({
            where: { is_active: true },
            include: [{ model: invoiceDetail, include: [PriceTable] }]
        });
        return res.status(200).json({ status: 200, data: invoices });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error al buscar las facturas', error: error.message });
    }
};

module.exports = {
    getAllInvoice,
    createInvoiceLogic,
};
