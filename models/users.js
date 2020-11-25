const Sequelize = require('sequelize');
const config = require('../config/config.js');

const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
	host: config.db.host,
	port: config.db.port,
	dialect: config.db.dialect,
});

const { Model } = Sequelize;
class Users extends Model {}
Users.init(
	{
		user_ID: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			allowNull: true,
			primaryKey: true,
		},
		email: {
			type: Sequelize.STRING(50),
			allowNull: false,
		},
		registration_date: {
			type: Sequelize.DATEONLY,
			allowNull: true,
			defaultValue: Sequelize.fn('CURDATE'),
		},
		phone: {
			type: Sequelize.STRING(20),
			allowNull: false,
		},
		shop_ID: {
			type: Sequelize.INTEGER,
			allowNull: true,
			defaultValue: '1',
		},
	},
	{
		sequelize,
		tableName: 'users',
		timestamps: false,
	}
);

module.exports = Users;
