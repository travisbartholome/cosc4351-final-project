require('dotenv').config();

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
        const { productId, idCookie } = response.body;
        expect(productId).toEqual(42);
        expect(idCookie).toEqual('test-id-cookie');
      });
  });

  it('should respond correctly on POST to /api/cart/remove', () => {
    // Mock out removeItemFromCart
    dbFunctions.removeItemFromCart = (productId, idCookie) => Promise.resolve({
      cart: {
        // Making sure these values get passed through
        productId,
        idCookie,
      },
    });

    return request(app)
      .post('/api/cart/remove')
      .set('Cookie', ['id=test-cart-remove'])
      .send({ productId: 42 })
      .expect(200)
      .then(response => {
        const { productId, idCookie } = response.body;
        expect(productId).toEqual(42);
        expect(idCookie).toEqual('test-cart-remove');
      })
  });

  describe('validate', () => {
    it('should respond correctly for a valid address', () => {
      const queryParams = {
        street1: '4800 calhoun rd',
        street2: '',
        city: 'houston',
        state: 'tx',
        zipcode: '77004',
      };
      
      return request(app)
        .get('/api/validate')
        .query(queryParams)
        .expect(200)
        .then(response => {
          const { addressValid, address } = response.body;
          expect(addressValid).toEqual(true);
          expect(address).toBeDefined();
          expect(address).toMatchSnapshot();
        });
    });

    it('should respond correctly for an invalid address', () => {
      const queryParams = {
        street1: 'asdf',
        street2: 'asdf',
        city: 'asdf',
        state: 'asdf',
        zipcode: 'asdf',
      };
      
      return request(app)
        .get('/api/validate')
        .query(queryParams)
        .expect(200)
        .then(response => {
          const { addressValid, address } = response.body;
          expect(addressValid).toEqual(false);
          expect(address).not.toBeDefined();
        });
    });
  });
});
