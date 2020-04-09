const request = require('supertest');
const express = require('express');

const app = require('../app');

describe('App', () => {
  it('should successfully render a page on GET to /', done => {
    request(app)
      .get('/')
      .expect(200, done);
  });
});

afterAll(() => {
  app.shutDown();
});
