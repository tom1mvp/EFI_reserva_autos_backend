const { User } = require('../models');
const bcrypt = require('bcrypt');

// Method's get
const getAllUser = async (req, res) => {
    try {
        const user = await User.findAll();

        res.json({ status: 200, data: user });
    } catch(error) {
        res.status(500).json({ status: 500, message: 'Error al obtener usuarios', error: error.message });
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.paramms.id);

        if(!user) {
            return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
        }
        res.json({ status: 200, data: user });
    } catch(error) {
        res.status(500).json({ status: 500, message: 'Error al obtener usuario', error: error.message });
    }
}

const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;

        if(!username) {
            return res.status(404).json({ status: 404, message: 'Libro no encontrado'});
        }

        const user = await User.findOne({
            where: { username, is_active: true }
        });

        if(!user) {
            return res.status(404).json({ status: 404, message: 'No se encontro el username del usuario'});
        }

        res.status(200).json({ status: 200, data: user });

    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al obtener usuarios', error: error.message });
    }
}

// Method put
const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.parms.id);

        if(!user) {
            return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
        }

        const { username, password, mail, role, image } = req.body;

        const hashed = await bcrypt.hash(password, 10);

        user.username = username || user.username;
        user.password = hashed || user.password;
        user.mail = mail || user.mail;
        user.role = role || user.role;
        user.image = image || user.image;

        await user.save();

        res.status(200).json({ status: 200, message: 'Usuario editado exitosamente', data: user });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al editar usuario', error: error.message });
    }
}

// Method delete
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if(!user) {
            return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
        }

        if(user.is_active){
            user.is_activate = false;
            await user.save();
        }

        res.status(200).json({ status: 200, message: 'Usuario eliminado exitosamente' });
    } catch(error) {
        res.status(500).json({ status: 500, message: 'Error al eliminar usuario', error: error.message });
    }
}

module.exports = {
    getAllUser,
    getUserById,
    getUserByUsername,
    updateUser,
    deleteUser
}