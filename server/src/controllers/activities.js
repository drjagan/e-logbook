import { Activity } from '../models/Activity.js';
import { AppError } from '../middleware/errorHandler.js';
import { validationResult } from 'express-validator';

// @desc    Create new activity
// @route   POST /api/activities
// @access  Private
export const createActivity = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    const activity = await Activity.create({
      ...req.body,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      data: activity
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all activities for logged in user
// @route   GET /api/activities
// @access  Private
export const getActivities = async (req, res, next) => {
  try {
    const { type, startDate, endDate, page = 1, limit = 10 } = req.query;
    const query = { user: req.user.id };

    // Filter by type if provided
    if (type) {
      query.type = type;
    }

    // Filter by date range if provided
    if (startDate || endDate) {
      query.activityDate = {};
      if (startDate) query.activityDate.$gte = new Date(startDate);
      if (endDate) query.activityDate.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const activities = await Activity.find(query)
      .sort({ activityDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Activity.countDocuments(query);

    res.status(200).json({
      success: true,
      data: activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Private
export const getActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!activity) {
      return next(new AppError('Activity not found', 404));
    }

    res.status(200).json({
      success: true,
      data: activity
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private
export const updateActivity = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    let activity = await Activity.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!activity) {
      return next(new AppError('Activity not found', 404));
    }

    activity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: activity
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private
export const deleteActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!activity) {
      return next(new AppError('Activity not found', 404));
    }

    await activity.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get activity statistics
// @route   GET /api/activities/stats
// @access  Private
export const getActivityStats = async (req, res, next) => {
  try {
    const stats = await Activity.aggregate([
      {
        $match: { user: req.user._id }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const monthlyStats = await Activity.aggregate([
      {
        $match: { user: req.user._id }
      },
      {
        $group: {
          _id: {
            year: { $year: '$activityDate' },
            month: { $month: '$activityDate' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1 }
      },
      {
        $limit: 12
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        byType: stats,
        monthly: monthlyStats
      }
    });
  } catch (err) {
    next(err);
  }
};
