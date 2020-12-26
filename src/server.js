const fs = require('fs');
const http = require('http');
const dotenv = require('dotenv');

dotenv.config({
  path: fs.existsSync('../.env.production') ? '../.env.production' : '../.env',
});

const { requestHandler } = require('./modules/requestHandler');

http
  .createServer(async (req, res) => {
    requestHandler(req, res);
  })
  .listen(3000);
