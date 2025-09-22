const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sequelize, People, User } = require('../models');
const { where } = require('sequelize');

const { crypto } = require('crypto');
const { configDotenv } = require('dotenv');

const register = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, age, gender, birthday, dni, email, phone, username, password, confirm_password, role, is_active } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username y password son requeridos' });
    }

    const peopleExist = await People.findOne({ where: { name }, transaction: t });
    if (peopleExist) return res.status(400).json({ message: 'La persona ya fue registrada' });

    const userExist = await User.findOne({ where: { username }, transaction: t });
    if (userExist) return res.status(400).json({ message: 'El usuario ya existe' });

    const new_people = await People.create(
      { name, age, gender, birthday, dni, phone, is_active: true, },
      { transaction: t }
    );

    let hashedPassword;

    if(password === confirm_password) {
     hashedPassword = await bcrypt.hash(password, 10);
    } else {
      return res.status(400).json({ status: 400, message: 'Las contraseñas no coiciden'});
    }


    const new_user = await User.create(
      {
        people_id: new_people.id,
        username,
        password: hashedPassword,
        email,
        is_active: true,
        role: role || 'customer',
      },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json({ message: 'Registro exitoso', data: { people: new_people, user: new_user } });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Error al registrar', error: error.message });
  }
};


const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExist = await User.findOne({ where: { username } });
    if (!userExist) return res.status(400).json({ message: 'Usuario no encontrado' });

    const validPassword = await bcrypt.compare(password, userExist.password);
    if (!validPassword) return res.status(403).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: userExist.id, role: userExist.role }, 'AbcDLZ', { expiresIn: '1h' });
    const role = userExist.role;
    res.json(
      {
        message: 'Inicio de sesión exitoso',
        token,
        role,
        username: userExist.username,
        id: userExist.id
      }
    );
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Error al loguear el usuario', error: error.message });
  }
};


const resetTokens = new Map()

const restEmailTemplate = (name, resetUrl) => {
  return `
    <div style="max-width: 520px; margin:0; padding: 20px;">
      <h2>
        Recupera tu contraseña
      </h2>
      <p>
        Hola ${name || ''}, recibimos tu solicitud para restablecer tu contraseña
      </p>
      <p>
        Click en el boton para continuar
      </p>
      <p>
        <a href=${resetUrl}>
            Cambiar contaseña
        </a>
      </p>
      <p>
        Si no has solicitado un cambio de contraseña, ignora este mensaje
      </p>
    </div>
  `
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'El usuario no existe' });

    const newToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(newToken).digest('hex');

    const expireToken = Date.now() + 15 * 60 * 1000;
    resetTokens.set(user.id, { tokenHash, expireToken });

    const resetURL = `${process.env.FRONT_URL || 'http://localhost:5173'}/recover-password?token=${newToken}&id=${user.id}`;

    const html = restEmailTemplate({ name: user.name, resetURL });

    return res.status(200).json({ message: 'Email de recuperación enviado' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al enviar el mail' });
  }
};

const resetPassword = async (req, res) => {
  const { id, token, password, confirm_password } = req.body

  if(!id || !token || !password || !confirm_password) return res.status(400).json({ status: 400, message: 'Faltan datos'});

  try {
    const entry = resetTokens.get(Number(id))
    if(!entry) return res.status(400).json({ status: 400, message: 'Token invalido'});

    if(entry.expireToken < Date.now()) {
      return res.status(400).json({ status: 400, message: 'Token invalido'});
    }

    const tokenHash = crypto.createHash('sha256').update(newToken).digest('hex');

    if (tokenHash !== entry.tokenHash) return res.status(400).json({ status: 400, message: 'Token Invalido'});

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'El usuario no existe' });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    resetTokens.delete(Number(id));

    return res.status(200).json({ status: 200, message: 'Contraseña actualizada correctamente'});
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Error al recuperar la contraseña'});
  }
};


module.exports = { register, login, forgotPassword, resetPassword };
