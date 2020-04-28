const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const StudentSchema = new Schema({
  district:{
    type: String,
    required: true
  },
  school:{
    type: String,
    required: true
  },
  dob:{
    type: Date,
    required: true,
  },
  userId:{
    type: String,
    required: true
  }
});

mongoose.model('students', StudentSchema);