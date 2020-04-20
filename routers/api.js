const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

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

api.post('/cart/remove', (req, res) => {
  const { productId } = req.body;
  const userIdCookie = req.cookies.id;

  // Remove the specified item from the user's cart
  // Return the newe cart state as the POST response
  return dbFunctions
    .removeItemFromCart(productId, userIdCookie)
    .then(({ cart }) => res.json(cart));
});

module.exports = api;
