import mongoose from 'mongoose';

import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * This middleware is responsible to catch the errors from any request handler wrapped inside the {@link asyncHandler}
 *
 * @param {Error | ApiError} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns {Object} JSON response with error details.
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Check if the error is an instance of an ApiError class which extends native Error class
  if (!(error instanceof ApiError)) {
    // If not
    // Create a new ApiError instance to keep the consistency

    // Assign an appropriate status code
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? 400 : 500;

    // Set a message from native Error instance or a custom one
    const message = error.message || 'Something went wrong.';
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  // Now we are sure that the `error` variable will be an instance of ApiError class
  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}), // Error stack traces should be visible in development for debugging
  };

  // Send error response
  return res.status(error.statusCode).json(response);
};

export { errorHandler };
