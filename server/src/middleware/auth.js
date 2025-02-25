import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { AppError } from './errorHandler.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request object
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return next(new AppError('User not found', 404));
      }

      next();
    } catch (err) {
      return next(new AppError('Not authorized to access this route', 401));
    }
  } catch (err) {
    next(err);
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
