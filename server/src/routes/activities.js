import express from 'express';
import { body } from 'express-validator';
import {
  createActivity,
  getActivities,
  getActivity,
  updateActivity,
  deleteActivity,
  getActivityStats
} from '../controllers/activities.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Validation rules
const activityValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot be more than 200 characters'),
  body('type')
    .trim()
    .notEmpty()
    .withMessage('Activity type is required')
    .isIn([
      'Out Patients',
      'In Patients',
      'Procedures',
      'Research',
      'Teaching',
      'Seminars',
      'Presentations',
      'Outreach',
      'Laboratory'
    ])
    .withMessage('Invalid activity type'),
  body('report')
    .trim()
    .notEmpty()
    .withMessage('Report is required')
    .isLength({ max: 50000 })
    .withMessage('Report cannot be more than 50000 characters'),
  body('activityDate')
    .notEmpty()
    .withMessage('Activity date is required')
    .isISO8601()
    .withMessage('Invalid date format')
];

// Routes
router.route('/')
  .get(getActivities)
  .post(activityValidation, createActivity);

router.route('/stats')
  .get(getActivityStats);

router.route('/:id')
  .get(getActivity)
  .put(activityValidation, updateActivity)
  .delete(deleteActivity);

export default router;
