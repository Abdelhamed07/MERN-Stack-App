const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/user.controller');

//ath and sign up

router.post('/register', userController.register);
router.post('/auth', userController.login);
router.get('/test', passport.authenticate('jwt', {session: false}) ,(req, res, next) => {
    return res.send({ message: 'Hello'});
});

module.exports = router;