// Set up environment variables (contains db credentials)
require('dotenv').config();

// Import db code to be tested
const db = require('../db/db');
const dbFunctions = require('../db/dbFunctions');

// Tests related to database setup/models
describe('DB', () => {
  it('should have a Product model with expected properties', () => {
    return db.Product
      .findOne()
      .then(value => {
        expect(value).toMatchSnapshot();
      });
  });

  it('should have a Cart model with expected properties', () => {
    return db.Cart
      .findOne()
      .then(value => {
        expect(value).toMatchSnapshot();
      })
  });

  it('should have a CartItem model with expected properties', () => {
    return db.CartItem
      .findOne()
      .then(value => {
        expect(value).toMatchSnapshot();
      })
  });
});

// Tests related to database queries used in the application
describe('dbFunctions', () => {
  describe('getAllProducts', () => {
    it('should return a list of all products in the database', () => {
      return dbFunctions.getAllProducts().then(products => {
        // Should have multiple products
        expect(products.length).toBeGreaterThan(1);

        // Product object should look as expected
        expect(products[0]).toHaveProperty('id');
        expect(products[0]).toHaveProperty('name');
        expect(products[0]).toHaveProperty('description');
        expect(products[0]).toHaveProperty('price');
        expect(products[0]).toHaveProperty('quantity');
        expect(products[0]).toHaveProperty('image');
      });
    });
  });

  describe('getUserCart', () => {
    const userIdCookie = 'dcbda148-f351-43e0-9e8a-5c2f4643db5c';

    it('should return cart items associated with a given user', () => {
      return dbFunctions.getUserCart(userIdCookie).then(cart => {
        // Cart should look as expected for the test user
        expect(cart).toMatchSnapshot();
      });
    });

    it('should return an object with the correct cart structure', () => {
      return dbFunctions.getUserCart(userIdCookie).then(cart => {
        // Cart should have a `products` array
        expect(cart).toHaveProperty('products');
        expect(cart.products).toBeInstanceOf(Array);

        // Cart should have a `total` property
        expect(cart).toHaveProperty('total');
      });
    });
  });

  describe('addItemToCart', () => {
    const userIdCookieExisting = 'addItemToExistingCartTest';
    const userIdCookieNew = 'addItemToNewCartTest';
    const userIdCookieQuantityUpdate = 'addItemUpdateQuantityTest';

    beforeAll(() => {
      // Insert cart entry and cart item entry for the "pre-existing cart" test cookie
      return db.Cart.create({
        session_key: userIdCookieExisting,
      })
      .then(newCart => {
        return db.CartItem.create({
          cart_id: newCart.getDataValue('cart_id'),
          product_id: 7,
        });
      }) // Next, insert cart entry and item for the "pre-existing cart item" test
      .then(() => {
        return db.Cart.create({
          session_key: userIdCookieQuantityUpdate,
        });
      })
      .then(newCart => {
        return db.CartItem.create({
          cart_id: newCart.getDataValue('cart_id'),
          product_id: 9,
        });
      });
    });

    it('should add a cart_items entry when the user\'s cart already exists', () => {
      return dbFunctions.addItemToCart(5, userIdCookieExisting).then(result => {
        expect(result.session_key).toEqual(userIdCookieExisting);
        
        // Cart should have two items: product 7 (inserted in beforeAll) and
        // product 5 (inserted in this test block)
        const { products } = result.cart;
        expect(products).toHaveLength(2);
        expect(products.some(product => product.id === 5)).toBe(true);
        expect(products.some(product => product.id === 7)).toBe(true);

        // Clean up generated test data
        // First, clean up cart_items entries
        return db.CartItem.destroy({
          where: { cart_id: result.cart_id },
        })
        .then(() => {
          // Clean up generated entries in the carts table
          return db.Cart.destroy({
            where: { cart_id: result.cart_id },
          });
        });
      });
    });

    it('should add a cart_items entry when the user\'s cart does not already exist', () => {
      return dbFunctions.addItemToCart(3, userIdCookieNew).then(result => {
        expect(result.session_key).toEqual(userIdCookieNew);
        
        // Cart should have two items: product 7 (inserted in beforeAll) and
        // product 5 (inserted in this test block)
        const { products } = result.cart;
        expect(products).toHaveLength(1);
        expect(products[0].id).toEqual(3);

        // Clean up generated test data
        // First, clean up cart_items entries
        return db.CartItem.destroy({
          where: { cart_id: result.cart_id },
        })
        .then(() => {
          // Clean up generated entries in the carts table
          return db.Cart.destroy({
            where: { cart_id: result.cart_id },
          });
        });
      });
    });

    it('should update the quantity column if the cart item entry already existed', () => {
      return dbFunctions.addItemToCart(9, userIdCookieQuantityUpdate).then(result => {
        expect(result.session_key).toEqual(userIdCookieQuantityUpdate);

        // Cart should have one item row with productId === 9 and quantity === 2
        const { products } = result.cart;
        expect(products).toHaveLength(1);
        expect(products[0].id).toEqual(9);
        expect(products[0].quantity).toEqual(2);

        // Clean up generated data
        return db.CartItem.destroy({
          where: { cart_id: result.cart_id },
        })
        .then(() => {
          return db.Cart.destroy({
            where: { cart_id: result.cart_id },
          });
        });
      })
    });
  });
});

afterAll(() => {
  db.close();
});
