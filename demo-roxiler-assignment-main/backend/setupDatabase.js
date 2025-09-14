const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  multipleStatements: true
};

const setupDatabase = async () => {
  let connection;

  try {
    console.log('🔌 Connecting to MySQL server...');
    connection = await mysql.createConnection(dbConfig);

    console.log('✅ Connected to MySQL server');

    // Create database
    console.log('🏗️  Creating database...');
    await connection.query('CREATE DATABASE IF NOT EXISTS store_rating_system');
    await connection.query('USE store_rating_system');
    console.log('✅ Database created/selected');

    // Create tables
    console.log('📋 Creating tables...');

    // Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
          id INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(60) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          address TEXT(400),
          role ENUM('admin', 'user', 'store_owner') DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_email (email),
          INDEX idx_role (role),
          INDEX idx_name (name)
      )
    `);

    // Stores table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS stores (
          id INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          address TEXT(400),
          owner_id INT,
          average_rating DECIMAL(2,1) DEFAULT 0.0,
          total_ratings INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL,
          INDEX idx_name (name),
          INDEX idx_email (email),
          INDEX idx_rating (average_rating)
      )
    `);

    // Ratings table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ratings (
          id INT PRIMARY KEY AUTO_INCREMENT,
          user_id INT NOT NULL,
          store_id INT NOT NULL,
          rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
          UNIQUE KEY unique_user_store_rating (user_id, store_id),
          INDEX idx_store_id (store_id),
          INDEX idx_user_id (user_id),
          INDEX idx_rating (rating)
      )
    `);

    console.log('✅ Tables created successfully');

    // Create triggers using multipleStatements
    console.log('🔧 Creating triggers...');

    // Drop existing triggers if they exist and create new ones
    await connection.query(`
      DROP TRIGGER IF EXISTS update_store_rating_after_insert;
      DROP TRIGGER IF EXISTS update_store_rating_after_update;
      DROP TRIGGER IF EXISTS update_store_rating_after_delete;
      
      CREATE TRIGGER update_store_rating_after_insert
          AFTER INSERT ON ratings
          FOR EACH ROW
      BEGIN
          UPDATE stores 
          SET average_rating = (
              SELECT AVG(rating) 
              FROM ratings 
              WHERE store_id = NEW.store_id
          ),
          total_ratings = (
              SELECT COUNT(*) 
              FROM ratings 
              WHERE store_id = NEW.store_id
          )
          WHERE id = NEW.store_id;
      END;
      
      CREATE TRIGGER update_store_rating_after_update
          AFTER UPDATE ON ratings
          FOR EACH ROW
      BEGIN
          UPDATE stores 
          SET average_rating = (
              SELECT AVG(rating) 
              FROM ratings 
              WHERE store_id = NEW.store_id
          ),
          total_ratings = (
              SELECT COUNT(*) 
              FROM ratings 
              WHERE store_id = NEW.store_id
          )
          WHERE id = NEW.store_id;
      END;
      
      CREATE TRIGGER update_store_rating_after_delete
          AFTER DELETE ON ratings
          FOR EACH ROW
      BEGIN
          UPDATE stores 
          SET average_rating = COALESCE((
              SELECT AVG(rating) 
              FROM ratings 
              WHERE store_id = OLD.store_id
          ), 0),
          total_ratings = (
              SELECT COUNT(*) 
              FROM ratings 
              WHERE store_id = OLD.store_id
          )
          WHERE id = OLD.store_id;
      END;
    `);

    console.log('✅ Triggers created successfully');

    // Check if data already exists
    const [existingUsers] = await connection.query('SELECT COUNT(*) as count FROM users');

    if (existingUsers[0].count > 0) {
      console.log('📊 Data already exists, skipping dummy data insertion');
      return;
    }

    console.log('👥 Inserting dummy users...');

    // Hash passwords
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const userPassword = await bcrypt.hash('User123!', 10);
    const ownerPassword = await bcrypt.hash('Owner123!', 10);

    // Insert users
    const users = [
      {
        name: 'System Administrator Main',
        email: 'admin@system.com',
        password: adminPassword,
        address: '123 Admin Street, Admin City, AC 12345',
        role: 'admin'
      },
      {
        name: 'John Michael Smith Anderson',
        email: 'john.smith@email.com',
        password: userPassword,
        address: '456 Oak Avenue, Springfield, IL 62701',
        role: 'user'
      },
      {
        name: 'Sarah Elizabeth Johnson Williams',
        email: 'sarah.johnson@email.com',
        password: userPassword,
        address: '789 Pine Street, Madison, WI 53703',
        role: 'user'
      },
      {
        name: 'Michael David Brown Thompson',
        email: 'michael.brown@email.com',
        password: userPassword,
        address: '321 Elm Drive, Austin, TX 78701',
        role: 'user'
      },
      {
        name: 'Emily Catherine Davis Miller',
        email: 'emily.davis@email.com',
        password: userPassword,
        address: '654 Maple Lane, Portland, OR 97201',
        role: 'user'
      },
      {
        name: 'Robert James Wilson Garcia',
        email: 'robert.wilson@store.com',
        password: ownerPassword,
        address: '987 Commerce Boulevard, Seattle, WA 98101',
        role: 'store_owner'
      },
      {
        name: 'Jennifer Marie Martinez Rodriguez',
        email: 'jennifer.martinez@store.com',
        password: ownerPassword,
        address: '147 Business Park Drive, Denver, CO 80201',
        role: 'store_owner'
      },
      {
        name: 'Christopher Paul Anderson Taylor',
        email: 'chris.anderson@store.com',
        password: ownerPassword,
        address: '258 Industrial Way, Phoenix, AZ 85001',
        role: 'store_owner'
      },
      {
        name: 'Amanda Nicole Thomas Jackson',
        email: 'amanda.thomas@email.com',
        password: userPassword,
        address: '369 Residential Court, Miami, FL 33101',
        role: 'user'
      },
      {
        name: 'Daniel Richard White Harris',
        email: 'daniel.white@email.com',
        password: userPassword,
        address: '741 Suburban Road, Atlanta, GA 30301',
        role: 'user'
      }
    ];

    const userIds = [];
    for (const user of users) {
      const [result] = await connection.query(
        'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
        [user.name, user.email, user.password, user.address, user.role]
      );
      userIds.push({ id: result.insertId, role: user.role, email: user.email });
    }

    console.log('✅ Users inserted successfully');
    console.log('🏪 Inserting dummy stores...');

    // Get store owner IDs
    const storeOwners = userIds.filter(user => user.role === 'store_owner');

    const stores = [
      {
        name: 'Fresh Market Grocery Store',
        email: 'contact@freshmarket.com',
        address: '100 Market Street, Downtown District, New York, NY 10001',
        owner_id: storeOwners[0]?.id || null
      },
      {
        name: 'TechWorld Electronics Superstore',
        email: 'support@techworld.com',
        address: '200 Technology Avenue, Silicon Valley, CA 94043',
        owner_id: storeOwners[1]?.id || null
      },
      {
        name: 'Fashion Forward Clothing Boutique',
        email: 'info@fashionforward.com',
        address: '300 Style Boulevard, Fashion District, Los Angeles, CA 90028',
        owner_id: storeOwners[2]?.id || null
      },
      {
        name: 'BookHaven Literary Store',
        email: 'hello@bookhaven.com',
        address: '400 Reading Lane, University Quarter, Boston, MA 02108',
        owner_id: null
      },
      {
        name: 'HomeCraft Furniture Gallery',
        email: 'sales@homecraft.com',
        address: '500 Furniture Row, Interior Design District, Chicago, IL 60601',
        owner_id: null
      },
      {
        name: 'SportZone Athletic Equipment',
        email: 'team@sportzone.com',
        address: '600 Athletic Way, Sports Complex, Dallas, TX 75201',
        owner_id: null
      },
      {
        name: 'GreenThumb Garden Center',
        email: 'grow@greenthumb.com',
        address: '700 Garden Path, Botanical District, San Diego, CA 92101',
        owner_id: null
      },
      {
        name: 'PetPalace Animal Supplies',
        email: 'care@petpalace.com',
        address: '800 Pet Street, Animal Lover Avenue, Nashville, TN 37201',
        owner_id: null
      }
    ];

    const storeIds = [];
    for (const store of stores) {
      const [result] = await connection.query(
        'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
        [store.name, store.email, store.address, store.owner_id]
      );
      storeIds.push(result.insertId);
    }

    console.log('✅ Stores inserted successfully');
    console.log('⭐ Inserting dummy ratings...');

    // Get regular user IDs
    const regularUsers = userIds.filter(user => user.role === 'user');

    // Insert random ratings
    const ratings = [];

    // Generate ratings for each store from different users
    for (const storeId of storeIds) {
      // Randomly select 3-6 users to rate each store
      const numRatings = Math.floor(Math.random() * 4) + 3; // 3-6 ratings per store
      const selectedUsers = regularUsers
        .sort(() => 0.5 - Math.random())
        .slice(0, numRatings);

      for (const user of selectedUsers) {
        const rating = Math.floor(Math.random() * 5) + 1; // 1-5 rating
        ratings.push({
          user_id: user.id,
          store_id: storeId,
          rating: rating
        });
      }
    }

    for (const rating of ratings) {
      await connection.query(
        'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
        [rating.user_id, rating.store_id, rating.rating]
      );
    }

    console.log('✅ Ratings inserted successfully');

    // Display summary
    const [userCount] = await connection.query('SELECT COUNT(*) as count FROM users');
    const [storeCount] = await connection.query('SELECT COUNT(*) as count FROM stores');
    const [ratingCount] = await connection.query('SELECT COUNT(*) as count FROM ratings');

    console.log('\n📊 Database Setup Complete!');
    console.log('================================');
    console.log(`👥 Total Users: ${userCount[0].count}`);
    console.log(`🏪 Total Stores: ${storeCount[0].count}`);
    console.log(`⭐ Total Ratings: ${ratingCount[0].count}`);
    console.log('================================');

    console.log('\n🔐 Login Credentials:');
    console.log('================================');
    console.log('Admin Account:');
    console.log('  Email: admin@system.com');
    console.log('  Password: Admin123!');
    console.log('');
    console.log('Regular User Accounts:');
    console.log('  Email: john.smith@email.com');
    console.log('  Email: sarah.johnson@email.com');
    console.log('  Email: michael.brown@email.com');
    console.log('  Email: emily.davis@email.com');
    console.log('  Email: amanda.thomas@email.com');
    console.log('  Email: daniel.white@email.com');
    console.log('  Password: User123!');
    console.log('');
    console.log('Store Owner Accounts:');
    console.log('  Email: robert.wilson@store.com');
    console.log('  Email: jennifer.martinez@store.com');
    console.log('  Email: chris.anderson@store.com');
    console.log('  Password: Owner123!');
    console.log('================================');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 Please check your database credentials in the .env file');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 Please make sure MySQL server is running');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
};

// Run the setup
setupDatabase();
