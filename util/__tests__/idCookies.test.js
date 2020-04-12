const idCookies = require('../idCookies');

describe('idCookies', () => {
  it('should call res.cookie to attach a new id cookie if none is present', () => {
    const req = {
      cookies: {},
    };
    const res = {
      cookie: jest.fn(),
    };
    const next = jest.fn();

    idCookies(req, res, next);

    expect(res.cookie).toHaveBeenCalled();
    expect(res.cookie.mock.calls[0][0]).toBe('id'); // Name of the new cookie should be 'id' 
    expect(next).toHaveBeenCalled();
  });

  it('should not attach a new cookie if an id cookie is present', () => {
    const req = {
      cookies: {
        id: 'asdf',
      },
    };
    const res = {
      cookie: jest.fn(),
    };
    const next = jest.fn();

    idCookies(req, res, next);

    expect(res.cookie).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
