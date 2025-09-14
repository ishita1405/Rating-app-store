const { body, query, validationResult } = require('express-validator');

// Common validation rules
const nameValidation = body('name')
  .isLength({ min: 20, max: 60 })
  .withMessage('Name must be between 20 and 60 characters');

const emailValidation = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Please provide a valid email');

const passwordValidation = body('password')
  .isLength({ min: 8, max: 16 })
  .withMessage('Password must be between 8 and 16 characters')
  .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)
  .withMessage('Password must contain at least one uppercase letter and one special character');

const addressValidation = body('address')
  .optional()
  .isLength({ max: 400 })
  .withMessage('Address must not exceed 400 characters');

const ratingValidation = body('rating')
  .isInt({ min: 1, max: 5 })
  .withMessage('Rating must be between 1 and 5');

// Validation middleware for user registration
const validateUserRegistration = [
  nameValidation,
  emailValidation,
  passwordValidation,
  addressValidation,
];

// Validation middleware for user login
const validateUserLogin = [
  emailValidation,
  body('password').notEmpty().withMessage('Password is required'),
];

// Validation middleware for password update
const validatePasswordUpdate = [
  passwordValidation,
];

// Validation middleware for store creation
const validateStoreCreation = [
  body('name').notEmpty().isLength({ max: 255 }).withMessage('Store name is required and must not exceed 255 characters'),
  emailValidation,
  addressValidation,
];

// Validation middleware for rating submission
const validateRatingSubmission = [
  ratingValidation,
  body('store_id').isInt({ min: 1 }).withMessage('Valid store ID is required'),
];

// Query parameter validation for filtering and sorting
const validateQueryParams = [
  query('sortBy').optional().isIn(['name', 'email', 'address', 'role', 'created_at', 'average_rating']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['ASC', 'DESC']).withMessage('Sort order must be ASC or DESC'),
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validatePasswordUpdate,
  validateStoreCreation,
  validateRatingSubmission,
  validateQueryParams,
  handleValidationErrors,
};
