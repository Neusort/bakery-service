CREATE DATABASE bakery_db;

USE bakery_db;

CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    dietaryInfo VARCHAR(255)
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  itemId INT NOT NULL,
  customerId INT NOT NULL,
  text TEXT NOT NULL,
  rating INT NOT NULL,
  FOREIGN KEY (itemId) REFERENCES items(id),
  FOREIGN KEY (customerId) REFERENCES users(id)
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customerId INT NOT NULL,
  items JSON NOT NULL,
  totalAmount DECIMAL(10,2) NOT NULL,
  orderDate DATETIME NOT NULL,
  status VARCHAR(255) NOT NULL,
  FOREIGN KEY (customerId) REFERENCES users(id)
);

CREATE TABLE baking_classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  capacity INT NOT NULL
);

-- Sample Data
INSERT INTO items (name, description, price, dietaryInfo) VALUES
  ('Chocolate Chip Cookies', 'Classic chewy chocolate chip cookies.', 2.50, 'None'),
  ('Blueberry Muffins', 'Moist and delicious blueberry muffins.', 3.00, 'Gluten-free'),
  ('Carrot Cake', 'Creamy carrot cake with a hint of spice.', 5.00, 'Vegan');

-- Inserting sample baking classes
INSERT INTO baking_classes (name, description, date, time, capacity) VALUES
  ('Basic Bread Baking', 'Learn the fundamentals of bread baking.', '2024-03-10', '10:00:00', 10),
  ('Cake Decorating 101', 'Master the art of decorating cakes.', '2024-03-17', '14:00:00', 8);

-- Initial user for testing
INSERT INTO users (name, email, password) VALUES 
  ('Test User', 'test@example.com', '$2a$10$T1X.x60yL4B6t8Z3p4s41uQ.4w99sB/Q6Q9T5R.w/bO.bZ6N2s36.'); -- 'test' password

