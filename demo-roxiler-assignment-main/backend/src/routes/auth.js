const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { authenticateToken } = require('../middleware/auth');
const {
  validateUserRegistration,
  validateUserLogin,
  validatePasswordUpdate,
  handleValidationErrors
} = require('../middleware/validation');

// Public routes
router.post('/register', validateUserRegistration, handleValidationErrors, AuthController.register);
router.post('/login', validateUserLogin, handleValidationErrors, AuthController.login);

// Protected routes
router.get('/profile', authenticateToken, AuthController.getProfile);
router.put('/password', authenticateToken, validatePasswordUpdate, handleValidationErrors, AuthController.updatePassword);

module.exports = router;
