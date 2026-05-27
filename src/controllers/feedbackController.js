const Feedback = require('../models/Feedback');

const buildFeedbackScope = (req) => {
  if (req.user.role === 'admin') {
    return {};
  }

  return { user: req.user.id };
};

const createFeedback = async (req, res, next) => {
  try {
    const { title, message, rating } = req.body;

    if (!title || !message || rating === undefined) {
      return res.status(400).json({ message: 'Title, message, and rating are required' });
    }

    const feedback = await Feedback.create({
      user: req.user.id,
      title,
      message,
      rating,
    });

    return res.status(201).json({
      message: 'Feedback created successfully',
      feedback,
    });
  } catch (error) {
    next(error);
  }
};

const getFeedbacks = async (req, res, next) => {
  try {
    const query = buildFeedbackScope(req);

    const feedbacks = await Feedback.find(query)
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

const getFeedbackByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Not authorized to view this user feedback' });
    }

    const feedbacks = await Feedback.find({ user: userId })
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

const filterFeedbackByRating = async (req, res, next) => {
  try {
    const rating = Number(req.query.rating);

    if (Number.isNaN(rating)) {
      return res.status(400).json({ message: 'A valid rating query parameter is required' });
    }

    const query = {
      ...buildFeedbackScope(req),
      rating: { $gte: rating },
    };

    const feedbacks = await Feedback.find(query)
      .populate('user', 'name email role')
      .sort({ rating: -1, createdAt: -1 });

    return res.status(200).json({
      count: feedbacks.length,
      ratingThreshold: rating,
      feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

const getFeedbackStats = async (req, res, next) => {
  try {
    const scope = buildFeedbackScope(req);

    const [stats] = await Feedback.aggregate([
      { $match: scope },
      {
        $group: {
          _id: null,
          totalFeedbackCount: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          highestRating: { $max: '$rating' },
          lowestRating: { $min: '$rating' },
        },
      },
    ]);

    const response = stats || {
      totalFeedbackCount: 0,
      averageRating: 0,
      highestRating: 0,
      lowestRating: 0,
    };

    return res.status(200).json({
      stats: {
        totalFeedbackCount: response.totalFeedbackCount,
        averageRating: Number(response.averageRating.toFixed ? response.averageRating.toFixed(2) : response.averageRating),
        highestRating: response.highestRating,
        lowestRating: response.lowestRating,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getFeedbackById = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate('user', 'name email role');

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (req.user.role !== 'admin' && feedback.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this feedback' });
    }

    return res.status(200).json({ feedback });
  } catch (error) {
    next(error);
  }
};

const updateFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (req.user.role !== 'admin' && feedback.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this feedback' });
    }

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title ?? feedback.title,
        message: req.body.message ?? feedback.message,
        rating: req.body.rating ?? feedback.rating,
      },
      { new: true, runValidators: true }
    ).populate('user', 'name email role');

    return res.status(200).json({
      message: 'Feedback updated successfully',
      feedback: updatedFeedback,
    });
  } catch (error) {
    next(error);
  }
};

const deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (req.user.role !== 'admin' && feedback.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this feedback' });
    }

    await Feedback.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: 'Feedback deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFeedback,
  getFeedbacks,
  getFeedbackByUserId,
  filterFeedbackByRating,
  getFeedbackStats,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
};
