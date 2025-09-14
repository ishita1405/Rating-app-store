const { pool } = require('../config/database');

class Rating {
  static async create(ratingData) {
    const { user_id, store_id, rating } = ratingData;
    const query = `
      INSERT INTO ratings (user_id, store_id, rating) 
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE rating = VALUES(rating)
    `;
    const [result] = await pool.execute(query, [user_id, store_id, rating]);
    return result.insertId || result.info;
  }

  static async findByUserAndStore(userId, storeId) {
    const query = 'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?';
    const [rows] = await pool.execute(query, [userId, storeId]);
    return rows[0];
  }

  static async getByStoreId(storeId) {
    const query = `
      SELECT r.*, u.name as user_name, u.email as user_email 
      FROM ratings r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.store_id = ?
      ORDER BY r.created_at DESC
    `;
    const [rows] = await pool.execute(query, [storeId]);
    return rows;
  }

  static async getStats() {
    const query = 'SELECT COUNT(*) as total_ratings FROM ratings';
    const [rows] = await pool.execute(query);
    return rows[0].total_ratings;
  }

  static async delete(userId, storeId) {
    const query = 'DELETE FROM ratings WHERE user_id = ? AND store_id = ?';
    const [result] = await pool.execute(query, [userId, storeId]);
    return result.affectedRows > 0;
  }

  static async getAverageRating(storeId) {
    const query = 'SELECT AVG(rating) as average_rating FROM ratings WHERE store_id = ?';
    const [rows] = await pool.execute(query, [storeId]);
    return rows[0].average_rating || 0;
  }
}

module.exports = Rating;
