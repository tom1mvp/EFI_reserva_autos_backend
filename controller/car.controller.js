const { Car, sequelize } = require('../models');


const getCars = async (req, res) => {
    try {
        const cars = await Car.findAll();
        return res.status(200).json(cars);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener los autos', error: error.message });
    }
};

const getCarById = async (req, res) => {
    try {
        const { id } = req.params;
        const car = await Car.findByPk(id);
        
        if (!car) return res.status(404).json({ message: 'Auto no encontrado' });

        return res.status(200).json(car);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener el auto', error: error.message });
    }
};

const createCar = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { brand, model, color, age, price_day, available, stock, image, is_active } = req.body; 

        if (!brand || !model || !color || !age || price_day === undefined || stock === undefined) {
            return res.status(400).json({ message: 'Faltan datos requeridos' });
        }

        const newCar = await Car.create({
            brand, 
            model, 
            color, 
            age, 
            price_day, 
            available: available ?? true, 
            stock, 
            image: image ?? null, 
            is_active: is_active ?? true,
        }, { transaction: t});

        await t.commit();
        return res.status(201).json({ message: 'Auto creado exitosamente', data: newCar });
    } catch (error) {
        await t.rollback();
        return res.status(500).json({ message: 'Error al crear el auto', error: error.message });
    }
};

const updateCar = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const car = await Car.findByPk(id, { transaction: t });
        if (!car) return res.status(404).json({ message: 'Auto no encontrado' });
        await car.update(req.body, { transaction: t });
        await t.commit();
        return res.status(200).json({ message: 'Auto actualizado exitosamente', data: car });
    } catch (error) {
        await t.rollback();
        return res.status(500).json({ message: 'Error al actualizar el auto', error: error.message });
    }
};

const deleteCar = async (req, res) => {
    try {
        const car = await Car.findByPk(req.params.id);

        if (!car) return res.status(404).json({ message: 'Auto no encontrado' });

        if (car.is_active) {
            car.is_active = false;

            await car.save();
        }

        res.status(200).json({ status: 200, message: 'Auto eliminado exitosamente' });

    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al eliminar auto', error: error.message });
    }
}


module.exports = {createCar, getCars, getCarById, updateCar, deleteCar};