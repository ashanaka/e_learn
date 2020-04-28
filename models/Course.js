const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CourseSchema = new Schema({
  grade:{
    type: String,
    required: true
  },
  title:{
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true,
  },
  dateAdded:{
    type: Date,
    default: Date.now
  },
  teacherId:{
      type: String,
      required: true
  }
});

mongoose.model('courses', CourseSchema);