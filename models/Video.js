const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const VideoSchema = new Schema({
  episoide:{
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
  courseId:{
      type: String,
      required: true
  }
});

mongoose.model('videos', VideoSchema);