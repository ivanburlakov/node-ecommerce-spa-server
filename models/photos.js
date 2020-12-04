const Sequelize = require('sequelize');
const config = require('../config/config.js');

const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
	host: config.db.host,
	port: config.db.port,
	dialect: config.db.dialect,
});

const Photos = sequelize.define('Photos', {
		product_ID: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
			references: {
				model: 'products',
				key: 'product_ID',
			},
		},
		path: {
			type: Sequelize.STRING(255),
			allowNull: false,
		},
	},
	{
		tableName: 'photos',
		timestamps: false,
	}
);

module.exports = Photos;
