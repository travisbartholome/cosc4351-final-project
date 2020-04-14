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
});

afterAll(() => {
  db.close();
});
