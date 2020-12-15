const path = require('path');
const express = require('express');
const fs = require('fs');

require('dotenv').config({
  path: fs.existsSync('.env.production') ? '.env.production' : '.env',
});

const functions = require('./src/modules/functions.js');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/order', express.json(), async (req, res) => {
  const message = req.body;
  if (!req.body) return res.sendStatus(400);
  message.user.phone = decodeURIComponent(message.user.phone);
  message.user.email = decodeURIComponent(message.user.email);
  message.order.forEach((element) => {
    element.delivery = decodeURIComponent(element.delivery);
  });
  const userID = await functions.getUserID(message.user);
  const sendOrder = await functions.addOrders(userID, message.order);
  if (!userID || !sendOrder) return res.sendStatus(400);
  return res.sendStatus(200);
});

app.listen(port);
