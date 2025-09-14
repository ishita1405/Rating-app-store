const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const {
  validateUserRegistration,
  validateStoreCreation,
  validateQueryParams,
  handleValidationErrors
} = require('../middleware/validation');

// All admin routes require admin role
router.use(authenticateToken, authorizeRoles('admin'));

// Dashboard
router.get('/dashboard/stats', AdminController.getDashboardStats);

// User management
router.post('/users', validateUserRegistration, handleValidationErrors, AdminController.createUser);
router.get('/users', validateQueryParams, handleValidationErrors, AdminController.getAllUsers);
router.get('/users/:id', AdminController.getUserDetails);
router.delete('/users/:id', AdminController.deleteUser);

// Store management
router.post('/stores', validateStoreCreation, handleValidationErrors, AdminController.createStore);
router.get('/stores', validateQueryParams, handleValidationErrors, AdminController.getAllStores);
router.delete('/stores/:id', AdminController.deleteStore);

module.exports = router;
