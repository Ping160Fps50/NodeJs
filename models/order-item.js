const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const OrderItem = sequelize.define(
  "orderItem",
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
    tableName: "orderItems",
    createdAt: "created_at",
    updatedAt: false,
  },
);

module.exports = OrderItem;
