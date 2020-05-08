const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load Course Model
require('../models/StudentEnrolls');
const StudentEnrolls = mongoose.model('studentenrolls');

// Enroll student via POST
router.post('/enroll/:id', (req, res) => {

    StudentEnrolls.findOne({
        studentId: req.user.id,
        courseId: req.params.id
    })
        .then(studentenrolls => {
            if (studentenrolls) {
                req.flash('error_msg', 'You already enrolled');
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

module.exports = router;