// Import dependencies
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

// Add .env variables to environment
require('dotenv').config();

// Import local dependencies
const db = require('./db/db.js');
const idCookiesMiddleware = require('./util/idCookies');

// If environment defines a port, use it; if not, default to the standard 3000
const PORT = process.env.PORT || 3000;

// Create express app object
const app = express();

// Attach middleware
app.use(cookieParser()); // Parse cookie headers
app.use(idCookiesMiddleware); // Attach ID cookies when needed

// Set up express to serve static files from the /static directory
app.use('/static', express.static(path.join(__dirname, 'static')));

// Set up to render templates from the /views directory with EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set up main route for browse page
app.get('/', (req, res) => {
  // Render the template with products data
  db.Product.findAll({
    raw: true
  }).then(products => {
    res.render('browse', { products: products })
  });
});

// Route for cart page
app.get('/cart', (req, res) => {
  res.render('cart', {
    // TODO: add cart data
    cart: {},
  });
});

// Route for checkout page
app.get('/checkout', (req, res) => {
  res.render('checkout', { total: 1200 })
});

// Set the app to listen on a network port
const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`Visit localhost:${PORT} in your browser to view`);
});

// Add a method to shut down the app, mostly for testing
app.shutDown = () => {
  server.close();
  db.close();
};

// Export the app for use in other places (i.e., tests)
module.exports = app;
