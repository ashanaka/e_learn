const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load Course Model
require('../models/Course');
const Course = mongoose.model('courses');
// Load StudentEnrolls Model
require('../models/StudentEnrolls');
const StudentEnrolls = mongoose.model('studentenrolls');
// Load User Model
require('../models/User');
const User = mongoose.model('users');

// Course GET Register Route
router.get('/register', (req, res) => {
    res.render('courses/register');
});
// Add Course POST
router.post('/register', (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({ text: 'Please add a title' });
    }

    if (errors.length > 0) {
        res.render('courses/register', {
            title: req.body.title,
            description: req.body.description,
            grade: req.body.grade,
        });
    } else {
        const newCourse = new Course({
            title: req.body.title,
            description: req.body.description,
            grade: req.body.grade,
            teacherId: req.user.id
        });

        newCourse.save()
            .then(course => {
                req.flash('success_msg', 'New course added');
                res.redirect('/courses/courses');
            });
    }
});

// view the course list of particular teacher
router.get('/courses', (req, res) => {

    Course.find({ teacherId: req.user.id })
        .sort({ date: 'desc' })
        .then(courses => {
            res.render('courses/courses', {
                courses: courses
            });
        });
});

// View full list of course list (When browsing)
router.get('/browse', (req, res) => {
    Course.find()
        .sort({ dateAdded: 'desc' })
        .then(courses => {
            res.render('courses/courses', {
                courses: courses
            })
        })
});


// View particular course
router.get('/view/:id', (req, res) => {
    Course.findOne({
        _id: req.params.id
    })
        .then(course => {
            User.findOne({
                _id: course.teacherId
            })
                .then(userTeacher => {
                    res.render('courses/view', {
                        course: course,
                        teacher: userTeacher
                    });
                });
        });
});

// Delete Course
router.delete('/:id', (req, res) => {
    Course.remove({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Course removed');
            res.redirect('/courses/courses');
        });
});

module.exports = router;