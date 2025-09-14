const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: 'store_rating_system'
};

const verifyData = async () => {
  let connection;

  try {
    console.log('🔍 Verifying database data...\n');
    connection = await mysql.createConnection(dbConfig);

    // Display users by role
    console.log('👥 USERS BY ROLE:');
    console.log('=================');
    const [users] = await connection.query(`
      SELECT role, COUNT(*) as count, GROUP_CONCAT(email SEPARATOR ', ') as emails
      FROM users 
      GROUP BY role 
      ORDER BY FIELD(role, 'admin', 'store_owner', 'user')
    `);

    users.forEach(user => {
      console.log(`${user.role.toUpperCase()}: ${user.count} users`);
      console.log(`  Emails: ${user.emails}\n`);
    });

    // Display stores with their ratings
    console.log('🏪 STORES WITH RATINGS:');
    console.log('=======================');
    const [stores] = await connection.query(`
      SELECT s.name, s.email, s.average_rating, s.total_ratings, u.name as owner_name
      FROM stores s
      LEFT JOIN users u ON s.owner_id = u.id
      ORDER BY s.average_rating DESC
    `);

    stores.forEach(store => {
      console.log(`📍 ${store.name}`);
      console.log(`   Email: ${store.email}`);
      console.log(`   Rating: ${store.average_rating || 'No ratings'} ⭐ (${store.total_ratings} ratings)`);
      console.log(`   Owner: ${store.owner_name || 'No owner assigned'}\n`);
    });

    // Display recent ratings
    console.log('⭐ RECENT RATINGS:');
    console.log('==================');
    const [ratings] = await connection.query(`
      SELECT u.name as user_name, s.name as store_name, r.rating, r.created_at
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      JOIN stores s ON r.store_id = s.id
      ORDER BY r.created_at DESC
      LIMIT 10
    `);

    ratings.forEach(rating => {
      console.log(`${rating.user_name} rated "${rating.store_name}" → ${rating.rating} ⭐`);
    });

    console.log('\n✅ Database verification complete!');

  } catch (error) {
    console.error('❌ Error verifying data:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

verifyData();
