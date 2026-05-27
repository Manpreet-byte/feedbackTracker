const express = require('express');

const protect = require('../middleware/authMiddleware');
const {
  createFeedback,
  getFeedbacks,
  getFeedbackByUserId,
  filterFeedbackByRating,
  getFeedbackStats,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
} = require('../controllers/feedbackController');

const router = express.Router();

router.use(protect);

router.get('/user/:userId', getFeedbackByUserId);
router.get('/filter', filterFeedbackByRating);
router.get('/stats', getFeedbackStats);
router.route('/').post(createFeedback).get(getFeedbacks);
router.route('/:id').get(getFeedbackById).put(updateFeedback).delete(deleteFeedback);

module.exports = router;
