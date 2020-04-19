const db = require('./db');

// Get all products from the database
const getAllProducts = () => {
  return db.Product.findAll({
    raw: true
  });
};

// Find one cart item row with the specified cart and product numbers
const getCartItem = (cartId, productId) => {
  return db.CartItem.findOne({
    where: {
      cart_id: cartId,
      product_id: productId,
    },
    raw: true
  });
};

// Increase the `quantity` field of an existing cart items entry by 1
const increaseQuantityByOne = (cart_id, product_id) => {
  return db.CartItem.update(
    { quantity: db.sequelize.literal('quantity + 1') }, 
    { where: { cart_id, product_id },
  });
};

// Decrease the `quantity` field of an existing cart items entry by 1
const decreaseQuantityByOne = (cart_id, product_id) => {
  return db.CartItem.update(
    { quantity: db.sequelize.literal('quantity - 1') }, 
    { where: { cart_id, product_id },
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
      quantity: item['quantity'],
      description: item['product.description'],
      name: item['product.name'],
      image: item['product.image'],
    }));

    // Sum up the price of all the cart items
    const total = products.reduce((totalPrice, currentItem) => {
      return totalPrice + (currentItem.price * currentItem.quantity);
    }, 0);

    // Find the total number of items in the cart
    const totalItems = products.reduce((itemCount, product) => {
      return itemCount + product.quantity;
    }, 0);

    // Return the new cart object
    return ({
      products,
      total,
      totalItems,
    });
  });
};

// Add an item to the current user's cart
// Returns the new cart for that user along with some query metadata
const addItemToCart = async (productId, userIdCookie) => {
  // If the user doesn't already have a cart, we should create a new one for them
  const [cartData, cartCreated] = await db.Cart.findOrCreate({
    where: {
      session_key: userIdCookie,
    },
  });

  const cartId = cartData.getDataValue('cart_id');

  // Figure out if the user already had one of this item in their cart
  // (Not possible if the cart was just created)
  const existingCartItem = cartCreated ? false : await getCartItem(cartId, productId);

  if (existingCartItem) {
    // If so, just update the quantity column for that item in the cart
    const cartItem = await increaseQuantityByOne(cartId, productId);
  } else {
    // Otherwise, insert the newly added item into cart_items
    // Associate it with the found (or newly created) cart
    const cartItem = await db.CartItem.create({
      cart_id: cartId,
      product_id: productId,
    });
  }

  const userCart = await getUserCart(userIdCookie);
  
  return ({
    cart: userCart,
    cart_id: cartId,
    session_key: userIdCookie,
  });
};

// Remove an item from the current user's cart
// Returns the new cart for that user along with some metadata
const removeItemFromCart = async (productId, userIdCookie) => {
  // Get cart ID from cookie
  const cartData = await db.Cart.findOne({
    where: { session_key: userIdCookie },
  });
  const cartId = cartData.getDataValue('cart_id');

  // Find the existing cart_items entry
  const existingCartItem = await getCartItem(cartId, productId);

  if (existingCartItem.quantity === 1) {
    // If the user has only one of these items, delete the entry
    await db.CartItem.destroy({
      where: { cart_id: cartId, product_id: productId },
    });
  } else {
    // Otherwise, decrement the quantity of that item
    await decreaseQuantityByOne(cartId, productId);
  }

  const userCart = await getUserCart(userIdCookie);

  return ({
    cart: userCart,
    cart_id: cartId,
    session_key: userIdCookie,
  });
};

module.exports = {
  getAllProducts,
  getCartItem,
  increaseQuantityByOne,
  getUserCart,
  addItemToCart,
  removeItemFromCart,
};
