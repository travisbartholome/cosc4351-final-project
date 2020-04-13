const { Sequelize, Model, DataTypes } = require('sequelize');

// Create db connection
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false, // See https://github.com/brianc/node-postgres/issues/2009
            },
        },
        ssl: true,
        define: {
            timestamps: false
        }
    }
);

class Product extends Model { }

// Product data model
Product.init({
    price: DataTypes.DOUBLE,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING
}, { sequelize, modelName: 'product' });

// Function for closing the database connection
const close = () => {
    return sequelize.close();
}

module.exports = {
    Product: Product,
    close: close,
};
