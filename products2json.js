const fs = require('fs');

const Photos = require('./models/photos.js');
const Products = require('./models/products.js');

Products.hasOne(Photos, { foreignKey: 'product_ID' });

function updateJson() {
	Products.findAll({
		include: [
			{
				model: Photos,
				attributes: ['path'],
			},
		],
	})
		.then((products) => {
			return new Promise((resolve, reject) => {
				fs.writeFile('./public/data/products.json', JSON.stringify(products, null, 4), 'utf8', (err) => {
					if (err) reject(err);
					else resolve('"products.json" successfully written.');
				});
			});
		})
		.then((result) => {
			console.log(result);
		})
		.catch((err) => {
			console.error('Unable to connect to the database:', err);
		});
}

updateJson();
