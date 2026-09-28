const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Order = sequelize.define(
  "order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    tableName: "orders",
    createdAt: "created_at",
    updatedAt: false,
  },
);

module.exports = Order;
