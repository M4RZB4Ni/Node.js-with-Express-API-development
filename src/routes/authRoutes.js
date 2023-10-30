const { verifyRegister, verifyLogin } = require('../middleware/validation');


const express = require('express');
const router = express.Router();

const { registerUser, loginUser } = require('../controllers/authController');

router.post('/login', verifyLogin, loginUser);

router.post('/register', verifyRegister, registerUser);

module.exports = router;
