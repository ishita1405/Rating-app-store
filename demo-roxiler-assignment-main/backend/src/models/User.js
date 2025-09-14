const { pool } = require('../config/database');

class User {
  static async create(userData) {
    const { name, email, password, address, role = 'user' } = userData;
    const query = `
      INSERT INTO users (name, email, password, address, role) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [name, email, password, address, role]);
    return result.insertId;
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.execute(query, [email]);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  }

  static async updatePassword(id, hashedPassword) {
    const query = 'UPDATE users SET password = ? WHERE id = ?';
    const [result] = await pool.execute(query, [hashedPassword, id]);
    return result.affectedRows > 0;
  }

  static async getAll(filters = {}, sortBy = 'name', sortOrder = 'ASC') {
    let query = 'SELECT id, name, email, address, role, created_at FROM users WHERE 1=1';
    const params = [];

    if (filters.name) {
      query += ' AND name LIKE ?';
      params.push(`%${filters.name}%`);
    }

    if (filters.email) {
      query += ' AND email LIKE ?';
      params.push(`%${filters.email}%`);
    }

    if (filters.address) {
      query += ' AND address LIKE ?';
      params.push(`%${filters.address}%`);
    }

    if (filters.role) {
      query += ' AND role = ?';
      params.push(filters.role);
    }

    query += ` ORDER BY ${sortBy} ${sortOrder}`;

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async getStats() {
    const query = 'SELECT COUNT(*) as total_users FROM users';
    const [rows] = await pool.execute(query);
    return rows[0].total_users;
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  }

  static async updateRole(id, role) {
    const query = 'UPDATE users SET role = ? WHERE id = ?';
    const [result] = await pool.execute(query, [role, id]);
    return result.affectedRows > 0;
  }
}

module.exports = User;
