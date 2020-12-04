const Sequelize = require('sequelize');
const config = require('../config/config.js');

const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
	host: config.db.host,
	port: config.db.port,
	dialect: config.db.dialect,
});

const Products = sequelize.define('Products', {
		product_ID: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		title: {
			type: Sequelize.STRING(255),
			allowNull: false,
		},
		price: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		discount: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
	},
	{
		tableName: 'products',
		timestamps: false,
	}
);

module.exports = Products;
