const fs = require('fs');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const { jsonResponse, streamToString } = require('../modules/utils');
const { hash, verify } = require('../modules/passwordHash');
const { db } = require('../config/config.js');

const pool = new Pool(db);

const queries = {
  updateJson: `
  SELECT posts.title, posts.text, posts.price, posts.code, posts.link, posts.category_id, media.src
  FROM posts
  INNER JOIN media
  ON posts."ID" = media.post_id
  WHERE post_type_id = '1';`,
};

function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '10m',
  });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '90d',
  });
}

async function verifyAccessToken(req) {
  let verifiedPayload;
  const bearerHeader = req.headers.authorization;
  if (!bearerHeader) {
    return null;
  }
  const bearer = bearerHeader.split(' ');
  const accessToken = bearer[1];
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) return null;
    verifiedPayload = payload;
  });
  return verifiedPayload;
}

async function isAccessToken(req) {
  if (!req.headers.authorization) {
    return false;
  }
  return true;
}

function concatOrderItems(orderID, orderItems) {
  let valuesString = '';
  for (const orderItem of orderItems) {
    const { id, quantity } = orderItem;
    valuesString += `('${orderID}', '${id}', '${quantity}')`;
    if (orderItems.indexOf(orderItem) < orderItems.length - 1) {
      valuesString += ', ';
    }
  }
  return valuesString;
}

function concatOrders(orders) {
  let valuesString = '(';
  for (const item of orders) {
    const { ID } = item;
    valuesString += `'${ID}'`;
    if (orders.indexOf(item) < orders.length - 1) {
      valuesString += ', ';
    } else {
      valuesString += ')';
    }
  }
  return valuesString;
}

// async function updateJsons(req, res) {
//   let client;
//   try {
//     client = await pool.connect();
//     const products = await client.query(queries.updateJson);
//     const { rows } = products;
//     await fs.promises.writeFile(
//       `build/data/products-${Date.now()}.json`,
//       JSON.stringify(rows, null, 2),
//       'utf8'
//     );
//     // jsonResponse(res, 200, { error: false, message: 'All succefull!' });
//     client.release();
//   } catch (err) {
//     if (client) client.release();
//     // jsonResponse(res, 500, {
//     //   error: true,
//     //   message: 'Something went wrong.\nTry again later.',
//     // });
//     console.error('Unable to connect\nto the database:', err);
//   }
// }

async function token(req, res) {
  const result = await streamToString(req);
  const { refreshToken } = JSON.parse(decodeURI(result));
  if (refreshToken == null) return jsonResponse(res, 401);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
    if (err) return jsonResponse(res, 403);
    const accessToken = generateAccessToken({ email: payload.email });
    jsonResponse(res, 200, { accessToken });
  });
}

async function login(req, res) {
  let client;
  try {
    const result = await streamToString(req);
    const { email, password } = JSON.parse(decodeURI(result));
    client = await pool.connect();
    const user = await client.query(
      `SELECT password_hash
       FROM "users" 
       WHERE email = '${email}';`
    );
    if (user.rowCount < 1) {
      jsonResponse(res, 401, {
        message: 'User with this email\nis not registered.',
      });
    } else {
      const { password_hash } = user.rows[0];
      const passwordsMatch = await verify(password, password_hash);
      if (!passwordsMatch) {
        jsonResponse(res, 403, {
          message: 'Password is incorrect.',
        });
      } else {
        const jwtPayload = { email };
        const accessToken = generateAccessToken(jwtPayload);
        const refreshToken = generateRefreshToken(jwtPayload);
        jsonResponse(res, 200, { accessToken, refreshToken });
      }
    }
    client.release();
  } catch (err) {
    if (client) client.release();
    jsonResponse(res, 500, {
      message: 'Something went wrong.\nTry again later.',
    });
    console.error(err);
  }
}

async function register(req, res) {
  let client;
  try {
    const result = await streamToString(req);
    const { email, password } = JSON.parse(decodeURI(result));
    const hashedPassword = await hash(password);
    client = await pool.connect();
    const user = await client.query(
      `SELECT email, password_hash
       FROM "users" 
       WHERE email = '${email}';`
    );
    if (user.rowCount < 1) {
      await client.query(
        `INSERT INTO "users" (email, password_hash)
         VALUES ('${email}', '${hashedPassword}');`
      );
      jsonResponse(res, 200, { message: 'Registered' });
    } else if (user.rows[0].password_hash) {
      jsonResponse(res, 409, { message: 'This email\nis already registered.' });
    } else if (user.rows[0].email) {
      await client.query(
        `UPDATE "users"
         SET password_hash = '${hashedPassword}'
         WHERE email = '${email}'`
      );
      jsonResponse(res, 200, { message: 'Registered' });
    }
    client.release();
  } catch (err) {
    if (client) client.release();
    jsonResponse(res, 500, {
      message: 'Something went wrong.\nTry again later.',
    });
    console.error(err);
  }
}

async function order(req, res) {
  let client;
  try {
    let email;
    const loggedIn = await isAccessToken(req);
    if (loggedIn) {
      const verifiedPayload = await verifyAccessToken(req);
      if (!verifiedPayload)
        return jsonResponse(res, 403, {
          message: 'Please log in\nor enter email.',
        });
      email = verifiedPayload.email;
    }
    const data = await streamToString(req);
    const parsedData = JSON.parse(decodeURI(data));
    const { deliveryOptionID, deliveryAddress, orderItems } = parsedData;
    if (!email) email = parsedData.email;
    client = await pool.connect();
    let user = await client.query(
      `SELECT "ID", email
       FROM "users" 
       WHERE email = '${email}';`
    );
    if (user.rowCount < 1) {
      user = await client.query(
        `INSERT INTO "users" (email)
         VALUES ('${email}')
         RETURNING "ID";`
      );
    }
    const orderQuery = await client.query(
      `INSERT INTO "orders" (user_id, delivery_option_id, delivery_address)
       VALUES ('${user.rows[0].ID}', '${deliveryOptionID}', '${deliveryAddress}')
       RETURNING "ID";`
    );
    const orderItemsValues = concatOrderItems(
      orderQuery.rows[0].ID,
      orderItems
    );
    await client.query(
      `INSERT INTO "order_items" (order_id, product_id, quantity)
       VALUES ${orderItemsValues};`
    );
    jsonResponse(res, 200, { message: 'Order recieved!' });
    client.release();
  } catch (err) {
    if (client) client.release();
    jsonResponse(res, 500, {
      message: 'Something went wrong.\nTry again later.',
    });
    console.error(err);
  }
}

async function getUserOrders(req, res) {
  let client;
  try {
    const verifiedPayload = await verifyAccessToken(req);
    if (!verifiedPayload)
      return jsonResponse(res, 403, {
        message: 'Please log in\nor enter email.',
      });
    const { email } = verifiedPayload;
    client = await pool.connect();
    const user = await client.query(
      `SELECT "ID"
       FROM "users" 
       WHERE email = '${email}';`
    );
    const orders = await client.query(
      `SELECT "ID", created_at
       FROM "orders" 
       WHERE user_id = '${user.rows[0].ID}';`
    );
    const orderItems = await client.query(
      `SELECT order_id, product_id, quantity
       FROM "order_items" 
       WHERE order_id
       IN ${concatOrders(orders.rows)};`
    );
    const ordersWithItems = [];
    for (const item of orders.rows) {
      const { ID, created_at } = item;
      const items = orderItems.rows.filter(el => el.order_id === ID);
      const orderWithItems = {
        ID,
        created_at,
        items
      }
      ordersWithItems.push(orderWithItems);
    }
    jsonResponse(res, 200, { ordersWithItems });
    client.release();
  } catch (err) {
    if (client) client.release();
    jsonResponse(res, 500, {
      message: 'Something went wrong.\nTry again later.',
    });
    console.error(err);
  }
}

const apis = {
  '/api/order': order,
  // '/api/update_jsons': updateJsons,
  '/api/token': token,
  '/api/login': login,
  '/api/register': register,
  '/api/user-orders': getUserOrders,
};

module.exports = { apis };
