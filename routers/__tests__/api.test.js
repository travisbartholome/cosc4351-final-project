const request = require('supertest');
const express = require('express');

// Component under test
const api = require('../api');

// Will be mocking these out for testing purposes
const dbFunctions = require('../../db/dbFunctions');

const app = express();
app.use('/api', api);

describe('api', () => {
  it('should respond correctly on POST to /api/cart/add', () => {
    // Mock out addItemToCart
    dbFunctions.addItemToCart = (productId, idCookie) => Promise.resolve({
      cart: {
        // (Making sure these values get passed through)
        productId,
        idCookie,
      },
    });

    return request(app)
      .post('/api/cart/add')
      .set('Cookie', ['id=test-id-cookie'])
      .send({ productId: 42 })
      .expect(200)
      .then(response => {
        const {productId, idCookie } = response.body;
        expect(productId).toEqual(42);
        expect(idCookie).toEqual('test-id-cookie');
      });
  });
});
