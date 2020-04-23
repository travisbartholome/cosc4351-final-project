const USPS = require('usps-webtools');

module.exports = (street1, street2, city, state, zip) => {
  const usps = new USPS({
    server: 'http://production.shippingapis.com/ShippingAPI.dll',
    userId: process.env.DB_USPS,
    ttl: 10000, // TTL in milliseconds for request
  });

  return new Promise((resolve, reject) => {
    usps.verify({
      street1,
      street2,
      city,
      state,
      zip,
    }, (err, address) => {
      resolve(address);
    });
  });
};
