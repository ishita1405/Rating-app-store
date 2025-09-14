const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');

class AdminController {
  static async getDashboardStats(req, res) {
    try {
      const totalUsers = await User.getStats();
      const totalStores = await Store.getStats();
      const totalRatings = await Rating.getStats();

      res.json({
        message: 'Dashboard stats retrieved successfully',
        stats: {
          totalUsers,
          totalStores,
          totalRatings
        }
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async createUser(req, res) {
    try {
      const { name, email, password, address, role = 'user' } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const userId = await User.create({
        name,
        email,
        password: hashedPassword,
        address,
        role
      });

      res.status(201).json({
        message: 'User created successfully',
        userId
      });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async createStore(req, res) {
    try {
      const { name, email, address, owner_email } = req.body;

      let owner_id = null;
      if (owner_email) {
        const owner = await User.findByEmail(owner_email);
        if (!owner) {
          return res.status(400).json({ message: 'Store owner not found' });
        }
        owner_id = owner.id;

        // Update user role to store_owner if not already
        if (owner.role !== 'store_owner') {
          await User.updateRole(owner.id, 'store_owner');
        }
      }

      const storeId = await Store.create({
        name,
        email,
        address,
        owner_id
      });

      res.status(201).json({
        message: 'Store created successfully',
        storeId
      });
    } catch (error) {
      console.error('Create store error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const { name, email, address, role, sortBy = 'name', sortOrder = 'ASC' } = req.query;

      const filters = {};
      if (name) filters.name = name;
      if (email) filters.email = email;
      if (address) filters.address = address;
      if (role) filters.role = role;

      const users = await User.getAll(filters, sortBy, sortOrder);

      res.json({
        message: 'Users retrieved successfully',
        users
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getAllStores(req, res) {
    try {
      const { name, email, address, sortBy = 'name', sortOrder = 'ASC' } = req.query;

      const filters = {};
      if (name) filters.name = name;
      if (email) filters.email = email;
      if (address) filters.address = address;

      const stores = await Store.getAll(filters, sortBy, sortOrder);

      res.json({
        message: 'Stores retrieved successfully',
        stores
      });
    } catch (error) {
      console.error('Get all stores error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getUserDetails(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Remove password from response
      const { password, ...userDetails } = user;

      // If user is a store owner, get their store rating
      if (user.role === 'store_owner') {
        const store = await Store.findByOwnerId(user.id);
        if (store) {
          userDetails.storeRating = store.average_rating;
          userDetails.storeName = store.name;
        }
      }

      res.json({
        message: 'User details retrieved successfully',
        user: userDetails
      });
    } catch (error) {
      console.error('Get user details error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Check if user exists
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Prevent deleting admin users (optional security measure)
      if (user.role === 'admin' && user.id !== req.user.id) {
        return res.status(400).json({ message: 'Cannot delete other admin users' });
      }

      const deleted = await User.delete(id);
      if (!deleted) {
        return res.status(400).json({ message: 'Failed to delete user' });
      }

      res.json({
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async deleteStore(req, res) {
    try {
      const { id } = req.params;

      const deleted = await Store.delete(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Store not found' });
      }

      res.json({
        message: 'Store deleted successfully'
      });
    } catch (error) {
      console.error('Delete store error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = AdminController;
