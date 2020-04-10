const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('products', 'root', '', {
    dialect: 'mysql'
});

class Product extends Model { }

Product.init({
    price: DataTypes.DOUBLE,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING

}, { sequelize, modelName: 'product' });

module.exports = {
    Product: Product,
}