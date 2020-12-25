const fs = require('fs');
const http = require('http');

require('dotenv').config({
  path: fs.existsSync('../.env.production') ? '../.env.production' : '../.env',
});

const { rateLimiter } = require('./modules/rateLimiter');
const { requestHandler } = require('./modules/requestHandler');

http
  .createServer(async (req, res) => {
    rateLimiter(req, res, requestHandler);
  })
  .listen(3000);
