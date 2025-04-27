const Feedback = require('../models/Feedback');

// @desc    Submit feedback
// @route   POST /feedback
// @access  Public
exports.submitFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.create(req.body);
    res.status(201).json({
      success: true,
      data: feedback,
    });
  } catch (err) {
    console.error(err);
    // Handle validation errors specifically
     if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            success: false,
            error: messages
        });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get all feedback
// @route   GET /feedback
// @access  Public (adjust access control as needed)
exports.getFeedback = async (req, res, next) => {
  try {
    // Basic query object
    let query = {};

    // Filtering by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Sorting
    let sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      // Default sort by timestamp descending
      sort.timestamp = -1;
    }

    const feedback = await Feedback.find(query).sort(sort);

    res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
