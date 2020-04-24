const request = require('supertest');

const app = require('../app');
const dbFunctions = require('../db/dbFunctions');

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

    it('should render the browse page when the ID cookie is not set', () => {
      return request(app)
        .get('/browse')
        .expect(200);
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

    it('should render the order summary page successfully', () => {
      // Mock out the db function that clears cart entries
      const mockEmptyUserCart = jest.fn();
      dbFunctions.emptyUserCart = mockEmptyUserCart;

      return request(app)
        .post('/summary')
        .set('Cookie', ['id=dcbda148-f351-43e0-9e8a-5c2f4643db5c'])
        .send({
          firstName: 'John',
          lastName: 'Doe',
          street1: '4800 Calhoun Rd',
          street2: '',
          country: 'United States',
          state: 'TX',
          city: 'Houston',
          zipcode: '77204',
          paymentMethod: 'credit',
          ccName: 'John Doe',
          ccNumber: '1234567812345678',
        }).then(res => {
          // Check that the response matches what we expect
          delete res.header.date;
          expect(res.header).toMatchSnapshot();
          expect(res.text).toMatchSnapshot();

          // Check that cart entries would have been cleared out
          expect(mockEmptyUserCart).toHaveBeenCalledWith('dcbda148-f351-43e0-9e8a-5c2f4643db5c');
        });
    });

    it('should render the order summary page successfully if no ID cookie is provided', () => {
      // Mock out the db function that clears cart entries
      const mockEmptyUserCart = jest.fn();
      dbFunctions.emptyUserCart = mockEmptyUserCart;

      return request(app)
        .post('/summary')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          street1: '4800 Calhoun Rd',
          street2: '',
          country: 'United States',
          state: 'TX',
          city: 'Houston',
          zipcode: '77204',
          paymentMethod: 'credit',
          ccName: 'John Doe',
          ccNumber: '1234567812345678',
        }).then(res => {
          // Check that the response matches what we expect
          expect(res.text).toMatchSnapshot();
          // Check that cart entries would have been cleared out
          expect(mockEmptyUserCart).toHaveBeenCalledWith('');
        });
    });
  });
});

afterAll(() => {
  app.shutDown();
});
