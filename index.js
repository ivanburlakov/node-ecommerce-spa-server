require('dotenv').config()
const path = require('path');
const express = require('express');

const functions = require('./modules/functions.js');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/order', express.json(), async (req, res) => {
	const message = req.body;
	message.user.phone = decodeURIComponent(message.user.phone);
	message.user.email = decodeURIComponent(message.user.email);
	message.order.forEach((element) => {
		element.delivery = decodeURIComponent(element.delivery);
	});

	const userID = await functions.getUserID(message.user);

	await functions.addOrders(userID, message.order);

	if (!req.body) return res.sendStatus(400);

	res.json('Order recieved!');
});

app.listen(port);
