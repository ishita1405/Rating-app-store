-- Create database
CREATE DATABASE IF NOT EXISTS store_rating_system;
USE store_rating_system;

-- Users table
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
);

-- Stores table
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
);

-- Ratings table
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
);

-- Insert default admin user (password: Admin123!)
INSERT INTO users (name, email, password, address, role) VALUES 
('System Administrator', 'admin@system.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Address', 'admin');

-- Triggers to update store average rating
DELIMITER //
CREATE TRIGGER IF NOT EXISTS update_store_rating_after_insert
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
END//

CREATE TRIGGER IF NOT EXISTS update_store_rating_after_update
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
END//

CREATE TRIGGER IF NOT EXISTS update_store_rating_after_delete
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
END//
DELIMITER ;
