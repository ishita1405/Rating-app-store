const express = require('express');
const router = express.Router();
const StoreController = require('../controllers/StoreController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateQueryParams, handleValidationErrors } = require('../middleware/validation');

// Routes for normal users
router.get('/', authenticateToken, authorizeRoles('user'), validateQueryParams, handleValidationErrors, StoreController.getAllStores);
router.get('/:id', authenticateToken, StoreController.getStoreDetails);

// Routes for store owners
router.get('/my/store', authenticateToken, authorizeRoles('store_owner'), StoreController.getMyStore);

module.exports = router;
