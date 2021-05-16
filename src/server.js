const http = require('http');
const { requestHandler } = require('./modules/requestHandler');

http
  .createServer(async (req, res) => {
    requestHandler(req, res);
  })
  .listen(8000);
