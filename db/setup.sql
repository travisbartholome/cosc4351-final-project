-- Create DB
CREATE DATABASE cosc4351;

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
  cart_id INT NOT NULL,
  product_id INT NOT NULL
);

-- Import CSV dummy data into products table
\copy products FROM 'ABSOLUTE_PATH_TO_PROJECT_ROOT/db/products-dummy-data.csv' DELIMITER ',' CSV HEADER;
