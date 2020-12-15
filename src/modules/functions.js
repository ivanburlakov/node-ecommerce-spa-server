const fs = require('fs');

const Photos = require('../models/photos.js');
const Products = require('../models/products.js');
const Users = require('../models/users.js');
const Orders = require('../models/orders.js');

Products.hasOne(Photos, { foreignKey: 'product_ID' });

async function getUserID(userData) {
  try {
    const { email, phone } = userData;
    const where = { email, phone };
    const attributes = ['user_ID'];
    let user = await Users.findOne({ attributes, where });
    if (user) return user.user_ID;
    user = await Users.create(where);
    return user.user_ID;
  } catch (err) {
    console.error('Unable to get user id: ', err);
  }
}

async function addOrders(uid, order) {
  try {
    let { product_ID, quantity, delivery_address } = order.pop();
    const firstQuery = { user_ID: uid, product_ID, quantity, delivery_address };
    const firstOrder = await Orders.create(firstQuery);

    const orderArray = [];

    order.forEach((element) => {
      ({ product_ID, quantity, delivery_address } = element);
      const obj = { order_ID: firstOrder.ID, user_ID: uid, product_ID, quantity, delivery_address };
      orderArray.push(obj);
    });

    await Orders.bulkCreate(orderArray);
  } catch (err) {
    console.error('Unable to add order: ', err);
  }
}

async function updateJson() {
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
        fs.writeFile(
          './public/data/products.json',
          JSON.stringify(products, null, 4),
          'utf8',
          (err) => {
            if (err) reject(err);
            else resolve('"products.json" successfully written.');
          }
        );
      });
    })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    });
}

module.exports = {
  getUserID,
  addOrders,
  updateJson,
};
