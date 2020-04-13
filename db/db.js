const { Sequelize, Model, DataTypes } = require('sequelize');

// Create db connection
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

// Product data model
class Product extends Model { }
Product.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    price: DataTypes.DOUBLE,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING
}, { sequelize, modelName: 'product' });

// Cart data model
class Cart extends Model {}
Cart.init({
    cart_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    session_key: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, { sequelize, modelName: 'cart' });

// Cart item data model
class CartItem extends Model {}
CartItem.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    cart_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, { sequelize, modelName: 'cart_item' });

// Set up model/table relations
Cart.hasMany(CartItem, { foreignKey: 'cart_id' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });
Product.hasMany(CartItem, { foreignKey: 'id' });
CartItem.belongsTo(Product, { foreignKey: 'product_id' });

// Function for closing the database connection
const close = () => {
    return sequelize.close();
}

module.exports = {
    Product,
    Cart,
    CartItem,
    close,
};
