const express = require('express');
const router = express.Router();


const { createCar, getCars, getCarById, updateCar, deleteCar } = require('../controller/car.controller');


const verifyToken = require('../middlewares/verify_token');
const isAdmin = require('../middlewares/is_admin');

router.get('/', getCars);
router.get('/:id', getCarById);


router.post('/', createCar);
router.put('/:id', updateCar);
router.delete('/:id', deleteCar);

module.exports = router;