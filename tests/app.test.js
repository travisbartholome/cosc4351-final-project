const request = require('supertest');

const app = require('../app');

describe('App', () => {
  it('should successfully render a page on GET to /', done => {
    request(app)
      .get('/')
      .expect(200, done);
  });

  it('should successfully render a page on GET to /browse', done => {
    request(app)
      .get('/')
      .expect(200, done);
  });

  it('should successfully render a page on GET to /cart', done => {
    request(app)
      .get('/cart')
      .expect(200, done);
  });

  it('should successfully render a page on GET to /checkout', done => {
    request(app)
      .get('/checkout')
      .expect(200, done);
  });

  // Test that views are being rendered correctly
  describe('views', () => {
    it('should render the root/home page successfully', () => {
      return request(app)
        .get('/')
        .set('Cookie', ['id=dcbda148-f351-43e0-9e8a-5c2f4643db5c'])
        .then(res => {
          // Check response header
          delete res.header.date; // Changes with every request, no use in checking here
          expect(res.header).toMatchSnapshot();

          // Check response body
          expect(res.text).toMatchSnapshot();
        })
    });

    it('should render the browse page successfully', () => {
      return request(app)
        .get('/browse')
        .set('Cookie', ['id=dcbda148-f351-43e0-9e8a-5c2f4643db5c'])
        .then(res => {
          // Check response header
          delete res.header.date; // Changes with every request, no use in checking here
          expect(res.header).toMatchSnapshot();

          // Check response body
          expect(res.text).toMatchSnapshot();
        })
    });

    it('should render the cart page successfully', () => {
      return request(app)
        .get('/cart')
        .set('Cookie', ['id=dcbda148-f351-43e0-9e8a-5c2f4643db5c'])
        .then(res => {
          // Check response header
          delete res.header.date; // Changes with every request, no use in checking here
          expect(res.header).toMatchSnapshot();

          // Check response body
          expect(res.text).toMatchSnapshot();
        })
    });

    it('should render the checkout page successfully', () => {
      return request(app)
        .get('/checkout')
        .set('Cookie', ['id=dcbda148-f351-43e0-9e8a-5c2f4643db5c'])
        .then(res => {
          // Check response header
          delete res.header.date; // Changes with every request, no use in checking here
          expect(res.header).toMatchSnapshot();

          // Check response body
          expect(res.text).toMatchSnapshot();
        })
    });
  });
});

afterAll(() => {
  app.shutDown();
});
