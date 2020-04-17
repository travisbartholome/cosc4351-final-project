-- NOTE: This file was used to populate our database with some dummy data

-- Create DB
CREATE DATABASE cosc4351;

-- Connect to new DB
\c cosc4351;

-- Stores product information
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  quantity INT NOT NULL,
  price REAL NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(200) NOT NULL
);

-- Stores current cart information for users
CREATE TABLE carts (
  cart_id SERIAL PRIMARY KEY,
  session_key TEXT NOT NULL
);

-- Facilitates a many-to-many relationship between carts and products
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  cart_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1
);

-- Add dummy cart info
INSERT INTO carts (cart_id, session_key) VALUES
  (1, 'eeb8076d-8e3f-408f-b79b-816bd4e836ed'),
  (2, 'dcbda148-f351-43e0-9e8a-5c2f4643db5c');

-- Add dummy cart items
INSERT INTO cart_items (cart_id, product_id) VALUES
  (1, 3),
  (1, 6),
  (2, 4);

-- Import CSV dummy data into products table
\copy products FROM 'ABSOLUTE_PATH_TO_PROJECT_ROOT/db/products-dummy-data.csv' DELIMITER ',' CSV HEADER;
