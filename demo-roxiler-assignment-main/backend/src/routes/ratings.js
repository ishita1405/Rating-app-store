const express = require('express');
const router = express.Router();
const RatingController = require('../controllers/RatingController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateRatingSubmission, handleValidationErrors } = require('../middleware/validation');

// Routes for normal users
router.post('/', authenticateToken, authorizeRoles('user'), validateRatingSubmission, handleValidationErrors, RatingController.submitRating);
router.put('/', authenticateToken, authorizeRoles('user'), validateRatingSubmission, handleValidationErrors, RatingController.updateRating);
router.delete('/store/:store_id', authenticateToken, authorizeRoles('user'), RatingController.deleteRating);
router.get('/store/:store_id/my-rating', authenticateToken, authorizeRoles('user'), RatingController.getUserRating);

module.exports = router;
