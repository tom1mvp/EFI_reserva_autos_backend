const express = require('express');
const router = express.Router();
const { createRental, getRentals, finishRental, autoFinishRentals } = require('../controller/rental.controller');


const verifyToken = require('../middlewares/verify_token');
const isAdmin = require('../middlewares/is_admin');

// Historial de rentals
router.get('/rentals', verifyToken, getRentals);

// Crear rental
router.post('/rentals', verifyToken, createRental);

// Finalizar manualmente (admin)
router.post('/rentals/:id/finish', verifyToken, isAdmin, finishRental);

module.exports = router;