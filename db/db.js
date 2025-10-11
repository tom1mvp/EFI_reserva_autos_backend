const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');const dotenv = require('dotenv');
dotenv.config();


const db = process.env.DB_NAME;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

const host = process.env.DB_HOST;
const port = process.env.DB_PORT;

const sequelize = new Sequelize(db, user, password, {
  host: host,
  port: port,
  dialect: 'postgresql'
});

module.exports = sequelize