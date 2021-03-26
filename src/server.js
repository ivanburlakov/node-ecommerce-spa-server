const fs = require('fs');
const http = require('http');
const { ENV, ENV_PRODUCTION } = require('./modules/constants');
require('dotenv').config({
  path: fs.existsSync(ENV_PRODUCTION) ? ENV_PRODUCTION : ENV,
});
const { requestHandler } = require('./modules/requestHandler');

http
  .createServer(async (req, res) => {
    requestHandler(req, res);
  })
  .listen(8000);
