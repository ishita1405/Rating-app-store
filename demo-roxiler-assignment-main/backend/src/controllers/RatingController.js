const Rating = require('../models/Rating');
const Store = require('../models/Store');

class RatingController {
  static async submitRating(req, res) {
    try {
      const { store_id, rating } = req.body;
      const user_id = req.user.id;

      // Check if store exists
      const store = await Store.findById(store_id);
      if (!store) {
        return res.status(404).json({ message: 'Store not found' });
      }

      // Create or update rating
      await Rating.create({ user_id, store_id, rating });

      res.json({
        message: 'Rating submitted successfully'
      });
    } catch (error) {
      console.error('Submit rating error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updateRating(req, res) {
    try {
      const { store_id, rating } = req.body;
      const user_id = req.user.id;

      // Check if rating exists
      const existingRating = await Rating.findByUserAndStore(user_id, store_id);
      if (!existingRating) {
        return res.status(404).json({ message: 'Rating not found' });
      }

      // Update rating
      await Rating.create({ user_id, store_id, rating });

      res.json({
        message: 'Rating updated successfully'
      });
    } catch (error) {
      console.error('Update rating error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async deleteRating(req, res) {
    try {
      const { store_id } = req.params;
      const user_id = req.user.id;

      const deleted = await Rating.delete(user_id, store_id);
      if (!deleted) {
        return res.status(404).json({ message: 'Rating not found' });
      }

      res.json({
        message: 'Rating deleted successfully'
      });
    } catch (error) {
      console.error('Delete rating error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getUserRating(req, res) {
    try {
      const { store_id } = req.params;
      const user_id = req.user.id;

      const rating = await Rating.findByUserAndStore(user_id, store_id);

      res.json({
        message: 'User rating retrieved successfully',
        rating: rating || null
      });
    } catch (error) {
      console.error('Get user rating error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = RatingController;
