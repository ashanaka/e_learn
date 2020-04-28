const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const TeacherSchema = new Schema({
  subject:{
    type: String,
    required: true
  },
  nic:{
    type: String,
    required: true
  },
  userId:{
    type: String,
    required: true
  }
});

mongoose.model('teachers', TeacherSchema);