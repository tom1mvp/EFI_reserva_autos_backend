const express = require('express')
const router = express.Router()

const verifyToken = require('../middlewares/verify_token');
const isAdmin = require('../middlewares/isAdmin');


const { getAllPayment, createPayment } = require('../controller/payment.controller');

router.get("/", isAdmin, getAllPayment);

router.post("/", verifyToken, createPayment);


module.exports = router