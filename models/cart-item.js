const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const CartItem = sequelize.define(
  "cartItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    quantity: DataTypes.INTEGER,
  },
  {
    tableName: "cartItems",
    createdAt: "created_at",
    updatedAt: false,
  },
);

module.exports = CartItem;
