const express = require('express');
const { submitFeedback, getFeedback } = require('../controllers/feedbackController');

const router = express.Router();

router.route('/')
  .post(submitFeedback)
  .get(getFeedback);

module.exports = router;
