const express = require('express');
const router = express.Router();
const { createRental, autoFinishRentals } = require('../controller/rental.controller');


const verifyToken = require('../middlewares/verify_token');
const isAdmin = require('../middlewares/is_admin');

router.post('/rentals', createRental);

router.post('/rentals/:id/finish', autoFinishRentals);

module.exports = router;