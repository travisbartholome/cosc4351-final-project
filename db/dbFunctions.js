const db = require('./db');

// Get all products from the database
const getAllProducts = () => {
  return db.Product.findAll({
    raw: true
  });
};

// Get cart information for the current user (with product information
// joined in) from the database
const getUserCart = userIdCookie => {
  return db.CartItem.findAll({
    attributes: { exclude: ['id'] },
    include: [
      {
        model: db.Cart,
        where: {
          session_key: userIdCookie,
        },
      },
      {
        model: db.Product,
      },
    ],
    raw: true,
  }).then(items => {
    // Convert products information from DB to the usual products object format 
    const products = items.map(item => ({
      id: item['product.id'],
      price: item['product.price'],
      description: item['product.description'],
      name: item['product.name'],
      image: item['product.image'],
    }));

    // Sum up the price of all the cart items
    const total = products.reduce((totalPrice, currentItem) => {
      return totalPrice + currentItem.price;
    }, 0);

    // Return the new cart object
    return ({
      products,
      total,
    });
  });
};

// Add an item to the current user's cart
// Returns the new cart for that user along with some query metadata
const addItemToCart = (productId, userIdCookie) => {
  // If the user doesn't already have a cart, we should create a new one for them
  return db.Cart.findOrCreate({
    where: {
      session_key: userIdCookie,
    },
  })
  .then(([cartData, cartCreated]) => {
    // Insert the newly added item into cart_items
    // Associate it with the found (or newly created) cart
    return db.CartItem.create({
      cart_id: cartData.getDataValue('cart_id'),
      product_id: productId,
    });
  })
  .then((cartItem) => {
    return getUserCart(userIdCookie).then(userCart => ({
      cart: userCart,
      cart_id: cartItem.getDataValue('cart_id'),
      session_key: userIdCookie,
    }));
  });
};

module.exports = {
  getAllProducts,
  getUserCart,
  addItemToCart,
};
