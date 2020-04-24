// Set up environment variables (contains db credentials)
require('dotenv').config();

// Import db code to be tested
const db = require('../db/db');
const dbFunctions = require('../db/dbFunctions');
const { Op } = require('sequelize');

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
        // Should have a `totalItems` property
        expect(cart).toHaveProperty('totalItems');
      });
    });
  });

  describe('addItemToCart', () => {
    const userIdCookieExisting = 'addItemToExistingCartTest';
    const userIdCookieNew = 'addItemToNewCartTest';
    const userIdCookieQuantityUpdate = 'addItemUpdateQuantityTest';

    let cartIdExisting, cartIdNew, cartIdQuantityUpdate;

    beforeAll(() => {
      // Insert cart entry and cart item entry for the "pre-existing cart" test cookie
      const cartExisting = db.Cart.create({
        session_key: userIdCookieExisting,
      }).then(newCart => {
        cartIdExisting = newCart.getDataValue('cart_id');
        return db.CartItem.create({
          cart_id: cartIdExisting,
          product_id: 7,
        });
      });

      // Create cart entry and item for the "pre-existing cart item" test
      const cartQuantity = db.Cart.create({
        session_key: userIdCookieQuantityUpdate,
      }).then(newCart => {
        cartIdQuantityUpdate = newCart.getDataValue('cart_id');
        return db.CartItem.create({
          cart_id: cartIdQuantityUpdate,
          product_id: 9,
        });
      });

      return Promise.all([cartExisting, cartQuantity]);
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
      });
    });

    it('should add a cart_items entry when the user\'s cart does not already exist', () => {
      return dbFunctions.addItemToCart(3, userIdCookieNew).then(result => {
        cartIdNew = result.cart_id; // Store cart id for cleanup

        expect(result.session_key).toEqual(userIdCookieNew);
        
        // Cart should have two items: product 7 (inserted in beforeAll) and
        // product 5 (inserted in this test block)
        const { products } = result.cart;
        expect(products).toHaveLength(1);
        expect(products[0].id).toEqual(3);
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
      });
    });

    // Clean up test data
    afterAll(() => {
      // First, clean up cart_items entries
      // Then clean up generated entries in the carts table
      return db.CartItem.destroy({
        where: {
          [Op.or]: [
            { cart_id: cartIdExisting },
            { cart_id: cartIdNew },
            { cart_id: cartIdQuantityUpdate },
          ],
        },
      })
      .then(() => {
        return db.Cart.destroy({
          where: {
            [Op.or]: [
              { cart_id: cartIdExisting },
              { cart_id: cartIdNew },
              { cart_id: cartIdQuantityUpdate },
            ],
          },
        });
      });
    });
  });

  describe('removeItemFromCart', () => {
    const userIdCookie = 'removeItemFromCartTest';
    let cartId;

    // Set up test data
    beforeAll(() => {
      return db.Cart.create({
        session_key: userIdCookie,
      }).then(newCart => {
        cartId = newCart.getDataValue('cart_id');

        return db.CartItem.create({
          cart_id: cartId,
          product_id: 7,
          quantity: 6,
        });
      });
    });

    it('should remove the cart_items entry', () => {
      return dbFunctions.removeItemFromCart(7, userIdCookie).then(result => {
        expect(result.session_key).toEqual(userIdCookie);

        // Products list should be empty
        const { products } = result.cart;
        expect(products).toHaveLength(0);
        
        // After deletion, no cart item entry should be found for this cart and product combination
        return db.CartItem.findOne({
          where: {
            cart_id: cartId,
            product_id: 7,
          },
          raw: true,
        }).then(cartItem => {
          expect(cartItem).toBeNull();
        });
      });
    });

    // Clean up test data
    afterAll(() => {
      return db.CartItem.destroy({
        where: { cart_id: cartId },
      })
      .then(() => {
        return db.Cart.destroy({
          where: { cart_id: cartId },
        });
      });
    });
  });

  describe('updateCartItem', () => {
    const idCookie = 'update-cart-item-test';
    let testCartId; // Store for cleanup

    // Create test data
    beforeAll(() => {
      return db.Cart.create({
        session_key: idCookie,
      }).then(newCart => {
        testCartId = newCart.getDataValue('cart_id');
        return db.CartItem.create({
          product_id: 2,
          cart_id: testCartId,
          quantity: 8,
        });
      });
    });

    it('should update the quantity of a specific cart item entry', () => {
      return dbFunctions.updateQuantity(2, idCookie, 12).then(result => {
        expect(result[0]).toEqual(1); // Number of affected rows

        return db.CartItem.findOne({
          where: { product_id: 2, cart_id: testCartId },
        }).then(cartItem => {
          // Make sure the quantity was correctly updated
          expect(cartItem.getDataValue('quantity')).toEqual(12);
          expect(cartItem.getDataValue('product_id')).toEqual(2);
          expect(cartItem.getDataValue('cart_id')).toEqual(testCartId);
        })
      });
    });

    afterAll(() => {
      return db.CartItem.destroy({
        where: { cart_id: testCartId },
      }).then(() => {
        return db.Cart.destroy({
          where: { cart_id: testCartId },
        });
      });
    });
  });

  describe('emptyUserCart', () => {
    const userIdCookie = 'emptyUserCartTest';
    let testCartId;

    // Set up test data
    beforeAll(() => {
      return db.Cart.create({
        session_key: userIdCookie,
      }).then(newCart => {
        testCartId = newCart.getDataValue('cart_id');
        return db.CartItem.create({
          product_id: 2,
          cart_id: testCartId,
          quantity: 8,
        });
      }).then(() => {
        return db.CartItem.create({
          product_id: 5,
          cart_id: testCartId,
          quantity: 3,
        });
      });
    });

    it('should remove all items from a user\'s cart', () => {
      return dbFunctions.emptyUserCart(userIdCookie).then(result => {
        expect(result).toEqual(2); // Number of rows deleted from cart_items

        // Check that there are no longer any matching cart items for the test user
        return db.CartItem.findOne({
          where: {
            cart_id: testCartId,
          },
          raw: true,
        }).then(cartItem => {
          expect(cartItem).toBeNull();
        });
      });
    });

    // Clean up test data
    afterAll(() => {
      return db.CartItem.destroy({
        where: { cart_id: testCartId },
      }).then(() => {
        return db.Cart.destroy({
          where: { cart_id: testCartId },
        });
      });
    });
  });
});

afterAll(() => {
  db.close();
});
