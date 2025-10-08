const express = require('express')
const router = express.Router()

const verifyToken = require('../middlewares/verify_token');
const isAdmin = require('../middlewares/is_admin');


const { getAllPriceTable, createPriceTable, updatePriceTable } = require('../controller/table_price.controller');

router.get("/",  getAllPriceTable);

router.post("/",  createPriceTable);

router.put("/:id", updatePriceTable);

module.exports = router