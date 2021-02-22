const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit')

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signUp);

const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5
});

router.post('/login',loginLimiter ,userCtrl.logIn )

module.exports = router;