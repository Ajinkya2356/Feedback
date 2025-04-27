const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  feedback: {
    type: String,
    required: [true, 'Please add feedback text'],
  },
  category: {
    type: String,
    enum: ['suggestion', 'bug_report', 'feature_request', 'other'],
    default: 'other',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
