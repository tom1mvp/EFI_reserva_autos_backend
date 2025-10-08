const express = require('express')
const router = express.Router()

const verifyToken = require('../middlewares/verify_token');
const isAdmin = require('../middlewares/is_admin')


const { getAllPayment, createPayment } = require('../controller/payment.controller');

router.get("/", getAllPayment);

router.post("/",  verifyToken, createPayment);


module.exports = router