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

module.exports = {
  getAllProducts,
  getUserCart,
};
