const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const USPS = require('usps-webtools');

// Import database functions
const dbFunctions = require('../db/dbFunctions');

const api = express.Router();

// Parse POST request bodies
api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());
api.use(cookieParser());

// Route for adding an item to the cart
api.post('/cart/add', (req, res) => {
  const { productId } = req.body;
  const userIdCookie = req.cookies.id;
  
  // Add the specified item to the current user's cart
  // Return the new cart state as the POST response
  return dbFunctions
    .addItemToCart(productId, userIdCookie)
    .then(({ cart }) => res.json(cart));
});

// Route for removing an item from the cart
api.post('/cart/remove', (req, res) => {
  const { productId } = req.body;
  const userIdCookie = req.cookies.id;

  // Remove the specified item from the user's cart
  // Return the new cart state as the POST response
  return dbFunctions
    .removeItemFromCart(productId, userIdCookie)
    .then(({ cart }) => res.json(cart));
});

api.post('/cart/update', (req, res) => {
  const { productId } = req.body;
  const userIdCookie = req.cookies.id;
  const quantity = req.body.quantity;

  dbFunctions.updateQuantity(productId, userIdCookie, quantity);
  
  res.json({"status": "success"});
});

// Validate address using the USPS API
api.get('/validate', (req, res) => {
  const { street1, street2, city, state, zipcode } = req.query;

  const usps = new USPS({
    server: 'http://production.shippingapis.com/ShippingAPI.dll',
    userId: process.env.DB_USPS,
    ttl: 10000, // TTL in milliseconds for request
  });

  usps.verify({
    street1: street1,
    street2: street2,
    city: city,
    state: state,
    zip: zipcode
  }, (err, address) => {
    res.json({
      addressValid: address ? true : false,
      address,
    });
  });
});

module.exports = api;
