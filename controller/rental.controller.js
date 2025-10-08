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

module.exports = { createRental, autoFinishRentals }