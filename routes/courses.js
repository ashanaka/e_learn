const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load Course Model
require('../models/Course');
const Course = mongoose.model('courses');

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

// view the course list to edit or remove videos
router.get('/courses', (req, res) => {
    Course.find({ teacherId: req.user.id })
        .sort({ date: 'desc' })
        .then(courses => {
            res.render('courses/courses', {
                courses: courses
            });
        });
});


// View particular course
router.get('/view/:id', (req, res) => {
    Course.findOne({
        _id: req.params.id
    })
        .then(course => {
            if (course.teacherId != req.user.id) {
                req.flash('error_msg', 'Not Authorized');
                res.redirect('/courses/courses');
            } else {
                res.render('courses/view', {
                    course: course
                });
            }

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