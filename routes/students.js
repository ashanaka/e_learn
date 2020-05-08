const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load StudentEnroll Model
require('../models/StudentEnrolls');
const StudentEnrolls = mongoose.model('studentenrolls');
// Load Course Model
require('../models/Course');
const Course = mongoose.model('courses');

// Enroll student via POST
router.post('/enroll/:id', (req, res) => {

    StudentEnrolls.findOne({
        studentId: req.user.id,
        courseId: req.params.id
    })
        .then(studentenrolls => {
            if (studentenrolls) {
                req.flash('error_msg', 'You have already enrolled');
                res.redirect('/courses/browse');
            } else {
                const newStudentEnrolls = new StudentEnrolls({
                    studentId: req.user.id,
                    courseId: req.params.id
                });

                newStudentEnrolls.save()
                    .then(studentenrolls => {
                        req.flash('success_msg', 'You were enrolled');
                        res.redirect('/courses/browse');
                    });
            }

        });
});

// View student's enrolled course lis
router.get('/mycourses', (req, res) => {
    let courseList = [];

    StudentEnrolls.find({ studentId: req.user.id })
        .then(studentenrolls => {
            studentenrolls.forEach(studentenroll => {
                Course.findOne({ _id: studentenroll.courseId })
                    .then(course => {
                        courseList.push({ course });
                    });
            });
            res.render('students/mycourses', {
                courseList: courseList
            });
        });
});

// Unsubscribe Course
router.delete('/:id', (req, res) => {
    StudentEnrolls.deleteOne({
        courseId: req.params.id,
        studentId: req.user.id
    })
        .then(() => {
            req.flash('success_msg', 'Course unsubscribed');
            res.redirect('/students/mycourses');
        });
});

module.exports = router;