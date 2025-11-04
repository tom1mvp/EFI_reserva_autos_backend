const { Op } = require('sequelize');


const { Rental, Car, sequelize } = require('../models');

const createRental = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { car_id, user_id, start_date, completion_date, daily_rate, total, observation } = req.body;
        // const user_id = req.user.id;

        const car = await Car.findOne({
          where: { id: car_id, is_active: true },
          transaction: t
        });

        if (!car || car.stock < 1 || !car.availble) {
            await t.rollback();
            return res.status(400).json({ message: 'El auto no está disponible' });
        }

        const rental = await Rental.create({
            car_id,
            user_id,
            start_date,
            completion_date,
            daily_rate,
            total,
            observation,
            is_active: true
        }, { transaction: t });

        await car.update({ stock: car.stock - 1 }, { transaction: t });

        await t.commit();
        res.status(201).json({ message: 'Alquiler creado', data: rental });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: 'Error al crear el alquiler', error: error.message });
    }
};

// GET /rental/rentals - historial con filtros
const getRentals = async (req, res) => {
  try {
    const { status, user_id, page = 1, limit = 10 } = req.query;
    const isAdmin = req.user && req.user.role === 'admin';

    const where = {};

    // Filtro por usuario: si no es admin, forzar su propio id
    if (isAdmin) {
      if (user_id) where.user_id = Number(user_id);
    } else if (req.user && req.user.id) {
      where.user_id = Number(req.user.id);
    }

    // Status: active | overdue | finished
    if (status === 'finished') {
      where.is_active = false;
    } else if (status === 'active') {
      where.is_active = true;
    } else if (status === 'overdue') {
      where.is_active = true;
      where.completion_date = { [Op.lt]: new Date() };
    }

    const offset = (Number(page) - 1) * Number(limit);

    const rentals = await Rental.findAll({
      where,
      order: [['start_date', 'DESC']],
      offset,
      limit: Number(limit)
    });

    // El frontend acepta [] o { data: [] }, devolvemos array directo
    return res.status(200).json(rentals);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener alquileres', error: error.message });
  }
};

// POST /rental/rentals/:id/finish - finalizar manualmente uno
const finishRental = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const rental = await Rental.findByPk(id, { transaction: t });
    if (!rental) {
      await t.rollback();
      return res.status(404).json({ message: 'Alquiler no encontrado' });
    }

    if (!rental.is_active) {
      await t.rollback();
      return res.status(400).json({ message: 'El alquiler ya está finalizado' });
    }

    const car = await Car.findByPk(rental.car_id, { transaction: t });

    await rental.update({ is_active: false }, { transaction: t });
    if (car) {
      await car.update({ stock: car.stock + 1 }, { transaction: t });
    }

    await t.commit();
    return res.status(200).json({ message: 'Alquiler finalizado', data: rental });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ message: 'Error al finalizar alquiler', error: error.message });
  }
};

const autoFinishRentals = async () => {
  const t = await sequelize.transaction();
  try {
    const today = new Date();


    const rentals = await Rental.findAll({
      where: {
        is_active: true,
        completion_date: {
          [Op.lt]: today
        }
      },
      transaction: t
    });

    if (rentals.length === 0) {
      console.log('No hay alquileres vencidos para finalizar.');
      await t.commit();
      return;
    }

    for (const rental of rentals) {

      const car = await Car.findByPk(rental.car_id, { transaction: t });
      if (!car) {
        console.warn(`Auto con ID ${rental.car_id} no encontrado`);
        continue;
      }


      await rental.update({ is_active: false }, { transaction: t });
      await car.update({ stock: car.stock + 1 }, { transaction: t });

      console.log(`Alquiler ${rental.id} finalizado automáticamente.`);
    }

    await t.commit();
  } catch (error) {
    await t.rollback();
    console.error('Error al finalizar alquileres automáticamente:', error);
  }
};

module.exports = { createRental, getRentals, finishRental, autoFinishRentals }