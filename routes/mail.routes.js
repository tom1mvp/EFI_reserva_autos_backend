const express = require('express')
const router = express.Router()

const verifyToken = require('../middlewares/verify_token');
const isAdmin = require('../middlewares/is_admin')

const { sendMailContact } = require('../controller/mails.controller');

router.post('/', verifyToken ,sendMailContact);


module.exports = router