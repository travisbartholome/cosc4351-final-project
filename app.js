// Import dependencies
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const USPS = require('usps-webtools');

// Add .env variables to environment
require('dotenv').config();

// Import local dependencies
const db = require('./db/db.js');
const dbFunctions = require('./db/dbFunctions');
const idCookiesMiddleware = require('./util/idCookies');
const apiRouter = require('./routers/api');

// If environment defines a port, use it; if not, default to the standard 3000
const PORT = process.env.PORT || 3000;

// Create express app object
const app = express();

// Attach routers
app.use('/api', apiRouter);

// Attach middleware
app.use(cookieParser()); // Parse cookie headers
app.use(idCookiesMiddleware); // Attach ID cookies when needed
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

// Set up express to serve static files from the /static directory
app.use('/static', express.static(path.join(__dirname, 'static')));

// Set up to render templates from the /views directory with EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set up main route for browse page
app.get('/', async (req, res) => {
  req.session.cart_id = '1'; // TODO: implement get card_id from session_id
  cart_id = req.session.cart_id;

  cart_items = await dbFunctions.getCartItems(cart_id);
  products = await dbFunctions.getAllProducts();

  // Render the template with products data
  res.render('browse', { products, cart_items });
});

// Route for cart page
app.get('/cart', async (req, res) => {
  cart_id = req.session.cart_id || 1;

  cart_items = await dbFunctions.getCartItems(cart_id);
  const total = cart_items.reduce((totalPrice, currentItem) => {
    return totalPrice + currentItem['product.price'] * currentItem.quantity;
  }, 0);

  res.render('cart', { cart_items, total });
});

// Route for checkout page
app.get('/checkout', (req, res) => {
  res.render('checkout', { total: 1200 })
});

app.get('/validate', (req, res) => {
  const street1 =  req.query.street1;
  const street2 =  req.query.street2;
  const city  = req.query.city;
  const state = req.query.state;
  const zipcode = req.query.zipcode;

  const usps = new USPS({
    server: 'http://production.shippingapis.com/ShippingAPI.dll',
    userId: process.env.DB_USPS,
    ttl: 10000 //TTL in milliseconds for request
  });

  usps.verify({
    street1: street1,
    street2: street2,
    city: city,
    state: state,
    zip: zipcode
  }, function(err, address) {
    if (address) {
      res.redirect('/success');
    } else {
      res.redirect('/error');
    }
  });

});

app.get('/success', (req, res) => {
  res.render('success')
});

app.get('/error', (req, res) => {
  res.render('error')
});

app.get('/add', async (req, res) => {
  const product_id = req.query.id;
  const cart_id = req.session.cart_id || 1;

  product = await dbFunctions.getCartItem(cart_id, product_id);
  
  if (product) {
    await dbFunctions.increaseQuantityByOne(cart_id, product_id);
  } else {
    await dbFunctions.addProductToCart(cart_id, product_id, 1);
  }

  products = await dbFunctions.getCartItems(cart_id);

  res.send({ result: products })
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
