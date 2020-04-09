// Import dependencies
const path = require('path');
const express = require('express');

// If environment defines a port, use it; if not, default to the standard 3000
const PORT = process.env.PORT || 3000;

// Create express app object
const app = express();

// Set up express to serve static files from the /static directory
app.use('/static', express.static(path.join(__dirname, 'static')));

// Set up to render templates from the /views directory with EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set up main route for browse page
app.get('/', (req, res) => {
  // Render the template with products data
  res.render('browse', {
    // TODO: fill this array with data from the db instead of hardcoded dummy data
    products: [
      {
        id: 1,
        name: 'Product 1',
        quantity: 10,
        price: 15.00,
        description: 'A very nice product.',
        image: 'image1.jpg',
      },
      {
        id: 2,
        name: 'Product 2',
        quantity: 50,
        price: 7.29,
        description: 'Yet another stellar product.',
        image: 'image1.jpg',
      },
      // ... etc.
    ],
  });
});

// Set the app to listen on a network port
const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`Visit localhost:${PORT} in your browser to view`);
});

// Add a method to shut down the app, mostly for testing
app.shutDown = () => {
  server.close();
};

// Export the app for use in other places (i.e., tests)
module.exports = app;
