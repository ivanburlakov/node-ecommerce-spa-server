const path = require('path');
const express = require('express');
const fs = require('fs');

require('dotenv').config({
  path: fs.existsSync('.env.production') ? '.env.production' : '.env',
});


const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/order', express.json(), );

app.listen(port);
