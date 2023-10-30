const { verifyRegister, verifyLogin } = require('../middleware/validation');
const { registerUser, loginUser } = require('../controllers/authController');


const express = require('express');
const router = express.Router();


router.post('/login', verifyLogin, loginUser);

router.post('/register', verifyRegister, registerUser);

module.exports = router;
