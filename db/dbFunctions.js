const db = require('./db');

const getCartItem = (cart_id, product_id) => {
  return db.CartItem.findOne({
    where: {  cart_id, product_id },
    raw: true
   });
}

const increaseQuantityByOne = (cart_id, product_id) => {
  return db.CartItem.update(
    { quantity: db.sequelize.literal('quantity + 1') }, 
    { where: { cart_id, product_id },
  });
}

const addProductToCart = (cart_id, product_id, quantity) => {
  return db.CartItem.create({
    cart_id,
    product_id,
    quantity
  });
}

const getCartItems = (cart_id) => {
  return db.CartItem.findAll({
    where: { cart_id },
    include: [db.Product],
    raw: true
  });
}

// Get all products from the database
const getAllProducts = () => {
  return db.Product.findAll({
    raw: true
  });
};

module.exports = {
  getCartItem,
  getCartItems,
  increaseQuantityByOne,
  addProductToCart,
  getAllProducts,
};
