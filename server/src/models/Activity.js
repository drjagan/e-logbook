import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide an activity title'],
    trim: true,
    maxLength: [200, 'Title cannot be more than 200 characters']
  },
  type: {
    type: String,
    required: [true, 'Please specify the activity type'],
    enum: [
      'Out Patients',
      'In Patients',
      'Procedures',
      'Research',
      'Teaching',
      'Seminars',
      'Presentations',
      'Outreach',
      'Laboratory'
    ]
  },
  report: {
    type: String,
    required: [true, 'Please provide an activity report'],
    maxLength: [50000, 'Report cannot be more than 50000 characters']
  },
  activityDate: {
    type: Date,
    required: [true, 'Please specify the date of activity'],
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastModified on save
activitySchema.pre('save', function(next) {
  this.lastModified = Date.now();
  next();
});

// Virtual field for formatted date
activitySchema.virtual('formattedDate').get(function() {
  return this.activityDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Ensure virtuals are included in JSON output
activitySchema.set('toJSON', { virtuals: true });
activitySchema.set('toObject', { virtuals: true });

// Index for better query performance
activitySchema.index({ user: 1, activityDate: -1 });
activitySchema.index({ type: 1 });

export const Activity = mongoose.model('Activity', activitySchema);
