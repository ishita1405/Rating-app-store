const Store = require('../models/Store');
const Rating = require('../models/Rating');

class StoreController {
  static async getAllStores(req, res) {
    try {
      const { name, address, sortBy = 'name', sortOrder = 'ASC' } = req.query;
      const userId = req.user.id;

      const filters = {};
      if (name) filters.name = name;
      if (address) filters.address = address;

      const stores = await Store.getAllForUser(userId, filters, sortBy, sortOrder);

      res.json({
        message: 'Stores retrieved successfully',
        stores
      });
    } catch (error) {
      console.error('Get stores error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getStoreDetails(req, res) {
    try {
      const { id } = req.params;
      const store = await Store.findById(id);

      if (!store) {
        return res.status(404).json({ message: 'Store not found' });
      }

      res.json({
        message: 'Store details retrieved successfully',
        store
      });
    } catch (error) {
      console.error('Get store details error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getMyStore(req, res) {
    try {
      const ownerId = req.user.id;
      const store = await Store.findByOwnerId(ownerId);

      if (!store) {
        return res.status(404).json({ message: 'No store found for this owner' });
      }

      // Get ratings for this store
      const ratings = await Rating.getByStoreId(store.id);

      res.json({
        message: 'Store details retrieved successfully',
        store: {
          ...store,
          ratings
        }
      });
    } catch (error) {
      console.error('Get my store error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = StoreController;
