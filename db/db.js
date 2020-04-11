const { Sequelize, Model, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        define: {
            timestamps: false
        }
    }
);

class Product extends Model { }

Product.init({
    price: DataTypes.DOUBLE,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING
}, { sequelize, modelName: 'product' });

module.exports = {
    Product: Product,
};
