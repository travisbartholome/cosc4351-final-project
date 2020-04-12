const uuid = require('uuid');

// Express middleware function that sets an ID cookie
// if the current user doesn't already have one
module.exports = (req, res, next) => {
  if (!req.cookies.id) {
    const id = uuid.v4(); // Random UUID
    const maxAge = 3600 * 24 * 180 * 1000; // Cookie lasts 180 days (value in milliseconds)
    
    // Create new ID cookie
    res.cookie('id', id, {
      maxAge: maxAge,
      sameSite: 'Strict',
    });
  }

  // Pass the Express call down to the next handler
  next();
}
