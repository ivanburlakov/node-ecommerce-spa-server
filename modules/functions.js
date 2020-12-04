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
    const lastOrderID = await Orders.findOne({
      limit: 1,
      order: [['id', 'DESC']],
    });

    const newOrderID = (() => {
      if (lastOrderID) return lastOrderID.order_ID + 1;
      return 1;
    })();

    const orderArray = [];

    order.forEach((element) => {
      const obj = {
        order_ID: newOrderID,
        user_ID: uid,
        product_ID: element.product_ID,
        quantity: element.quantity,
        delivery_address: element.delivery,
      };

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
