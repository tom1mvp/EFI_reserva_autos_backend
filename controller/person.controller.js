const { People } = require('../models');

const getAllPeople = async (req, res) => {
    try {
        const people = await People.findAll();

        res.json({ status: 200, data: people });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al obtener las personas', error: error.message });
    }
}

const getByName = async (req, res) => {
    try {
        const { name } = req.params;

        if(!name) {
            return res.status(400).json({ message: 'El nombre es requerido' });
        }

        const person = await People.findOne({
            where: { name }
        });

        if (!person) {
            return res.status(404).json({  message: 'No se encontró ninguna persona con ese nombre' });       
        }

        return res.json({ status: 200, data: person });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al obtener la persona', error: error.message });
    }
}

const getById = async (req, res) => {
    try {
        const person = await People.findByPk(req.params.id);

        if(!person) {
            return res.status(404).json({ status: 404, message: 'Persona no encontrada' });
        }
        res.json({ status: 200, data: person });
    } catch(error){
        res.status(500).json({ status: 500, message: 'Error al obtener la persona', error: error.message });
    }
}


module.exports = {
    getAllPeople,
    getByName,
    getById,
}