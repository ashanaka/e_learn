const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load User Model
require('../models/User');
const User = mongoose.model('users');
// Load Student Model
require('../models/Student');
const Student = mongoose.model('students');
// Load Teacher Model
require('../models/Teacher');
const Teacher = mongoose.model('teachers');

// User GET Register Route
router.get('/register', (req, res) => {
    res.render('users/register');
});
// User Register POST Route
router.post('/register', (req, res) => {
    let errors = [];

    if (req.body.password != req.body.conf_password) {
        errors.push({ text: 'Passwords do not match with each other' });
    }

    if (req.body.password.length < 4) {
        errors.push({ text: 'Password must be at least 4 characters' });
    }

    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            tel: req.body.tel,
            userType: req.body.userType,
            district: req.body.district,
            school: req.body.school,
            dob: req.body.dob,
            subject: req.body.subject,
            nic: req.body.nic,
            password: req.body.password,
            conf_password: req.body.conf_password
        });
    } else {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    req.flash('error_msg', 'Email already regsitered');
                    res.redirect('/users/register');
                } else {

                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        address: req.body.address,
                        tel: req.body.tel,
                        userType: req.body.userType,
                        password: req.body.password
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    if (user.userType == 'student') {
                                        const newStudent = new Student({
                                            district: req.body.district,
                                            school: req.body.school,
                                            dob: req.body.dob,
                                            userId: user.id
                                        });
                                        newStudent.save()
                                            .then(student => {
                                                req.flash('success_msg', 'You are now registered and can log in');
                                                res.redirect('/users/login');
                                            })
                                            .catch(err => {
                                                console.log(err);
                                                return;
                                            });
                                    } else {
                                        const newTeacher = new Teacher({
                                            subject: req.body.subject,
                                            nic: req.body.nic,
                                            userId: user.id
                                        });
                                        newTeacher.save()
                                            .then(teacher => {
                                                req.flash('success_msg', 'You are now registered and can log in');
                                                res.redirect('/users/login');
                                            })
                                            .catch(err => {
                                                console.log(err);
                                                return;
                                            });
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                });
                        });
                    });
                }
            });
    }
});

//   // Edit User PUT process
//   router.put('/edit/:id', (req, res) => {
//     User.findOne({
//         _id: req.params.id
//     })
//         .then(user => {
//             // new values
//             user.name = req.body.name;
//             user.email = req.body.email;
//             user.amountPerKG = req.body.amountPerKG;

//             user.save()
//                 .then(user => {
//                     req.flash('success_msg', 'User data updated');
//                     res.redirect('/');
//                 })
//         });
//   });



// User Login Route
router.get('/login', (req, res) => {
    res.render('users/login');
});
// Login Form POST
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout User
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
  });


module.exports = router;