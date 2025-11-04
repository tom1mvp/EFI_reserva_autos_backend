const express = require('express')
const router = express.Router()

const verifyToken = require('../middlewares/verify_token');
const isAdmin = require('../middlewares/is_admin')

const {
    getAllPeople,
    getByName,
    getById
} = require('../controller/person.controller');


router.get("/", isAdmin, getAllPeople);
router.get("/name/:name", getByName);
router.get("/:id", isAdmin, getById);

module.exports = router