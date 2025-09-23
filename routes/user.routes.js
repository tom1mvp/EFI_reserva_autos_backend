const express = require('express')
const router = express.Router()

const verifyToken = require('../middlewares/verify_token');
const isAdmin = require('../middlewares/isAdmin');


const {
    getAllUser,
    getUserById,
    getUserByUsername,
    updateUser,
    deleteUser
} =  require('../controller/user.controller');


router.get('/', isAdmin, getAllUser);
router.get('/username/:username', isAdmin, getUserByUsername)
router.get('/profile/:id', verifyToken, getUserById);


router.put('/update/:id', verifyToken, updateUser);
router.patch('/:id/status', verifyToken ,deleteUser);

module.exports = router