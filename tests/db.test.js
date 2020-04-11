// Set up environment variables (contains db credentials)
require('dotenv').config();

// Import db code to be tested
const db = require('../db/db');

describe('DB', () => {
  it('should return a product object with expected properties', () => {
    return db.Product
      .findOne()
      .then(value => {
        expect(value).toMatchSnapshot();
      });
  });
});

afterAll(() => {
  db.close();
});
