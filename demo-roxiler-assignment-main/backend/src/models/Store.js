const { pool } = require('../config/database');

class Store {
  static async create(storeData) {
    const { name, email, address, owner_id } = storeData;
    const query = `
      INSERT INTO stores (name, email, address, owner_id) 
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [name, email, address, owner_id]);
    return result.insertId;
  }

  static async findById(id) {
    const query = `
      SELECT s.*, u.name as owner_name 
      FROM stores s 
      LEFT JOIN users u ON s.owner_id = u.id 
      WHERE s.id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  }

  static async findByOwnerId(owner_id) {
    const query = 'SELECT * FROM stores WHERE owner_id = ?';
    const [rows] = await pool.execute(query, [owner_id]);
    return rows[0];
  }

  static async getAll(filters = {}, sortBy = 'name', sortOrder = 'ASC') {
    let query = `
      SELECT s.id, s.name, s.email, s.address, s.average_rating, s.total_ratings, s.created_at,
             u.name as owner_name
      FROM stores s 
      LEFT JOIN users u ON s.owner_id = u.id 
      WHERE 1=1
    `;
    const params = [];

    if (filters.name) {
      query += ' AND s.name LIKE ?';
      params.push(`%${filters.name}%`);
    }

    if (filters.email) {
      query += ' AND s.email LIKE ?';
      params.push(`%${filters.email}%`);
    }

    if (filters.address) {
      query += ' AND s.address LIKE ?';
      params.push(`%${filters.address}%`);
    }

    query += ` ORDER BY s.${sortBy} ${sortOrder}`;

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async getAllForUser(userId, filters = {}, sortBy = 'name', sortOrder = 'ASC') {
    let query = `
      SELECT s.id, s.name, s.email, s.address, s.average_rating, s.total_ratings,
             r.rating as user_rating
      FROM stores s 
      LEFT JOIN ratings r ON s.id = r.store_id AND r.user_id = ?
      WHERE 1=1
    `;
    const params = [userId];

    if (filters.name) {
      query += ' AND s.name LIKE ?';
      params.push(`%${filters.name}%`);
    }

    if (filters.address) {
      query += ' AND s.address LIKE ?';
      params.push(`%${filters.address}%`);
    }

    query += ` ORDER BY s.${sortBy} ${sortOrder}`;

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async getStats() {
    const query = 'SELECT COUNT(*) as total_stores FROM stores';
    const [rows] = await pool.execute(query);
    return rows[0].total_stores;
  }

  static async delete(id) {
    const query = 'DELETE FROM stores WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  }

  static async update(id, storeData) {
    const { name, email, address } = storeData;
    const query = 'UPDATE stores SET name = ?, email = ?, address = ? WHERE id = ?';
    const [result] = await pool.execute(query, [name, email, address, id]);
    return result.affectedRows > 0;
  }
}

module.exports = Store;
