const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load User Model
require('../models/User');
const User = mongoose.model('users');

// User Register Route
router.get('/register', (req, res) => {
    res.render('users/register');
});


// User Login Route
router.get('/login', (req, res) => {
    res.render('users/login');
});


module.exports = router;