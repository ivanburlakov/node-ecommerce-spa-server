const fs = require('fs');
const http = require('http');
const dotenv = require('dotenv');
const { requestHandler } = require('./modules/requestHandler');

dotenv.config({
  path: fs.existsSync('../.env.production') ? '../.env.production' : '../.env',
});

http
  .createServer(async (req, res) => {
    requestHandler(req, res);
  })
  .listen(3000);
