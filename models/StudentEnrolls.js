const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const StudentEnrollsSchema = new Schema({
  studentId:{
    type: String,
    required: true,
  },
  dateAdded:{
    type: Date,
    default: Date.now
  },
  courseId:{
      type: String,
      required: true
  }
});

mongoose.model('studentenrolls', StudentEnrollsSchema);