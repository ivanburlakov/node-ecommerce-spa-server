const Sequelize = require('sequelize');
const config = require('../config/config.js');

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: config.db.dialect,
  }
);

const Orders = sequelize.define(
  'Orders',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: true,
      primaryKey: true,
    },
    order_ID: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    order_date: {
      type: Sequelize.DATEONLY,
      allowNull: true,
      defaultValue: Sequelize.fn('CURDATE'),
    },
    user_ID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_ID',
      },
    },
    product_ID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'product_ID',
      },
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    delivery_address: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: 'orders',
    timestamps: false,
  }
);

module.exports = Orders;
