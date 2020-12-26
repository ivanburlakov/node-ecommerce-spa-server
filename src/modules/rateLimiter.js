const {
  rateLimiterWindow,
  requestsPerWindow,
  userRequestsPerWindow,
} = require('../config/config.js').server;

const users = new Map();
let frameStart = Date.now();
let requestsCounter = 0;

const parseIp = (req) =>
  (typeof req.headers['x-forwarded-for'] === 'string' &&
    req.headers['x-forwarded-for'].split(',').shift()) ||
  req.connection?.remoteAddress ||
  req.socket?.remoteAddress ||
  req.connection?.socket?.remoteAddress;

async function rateLimiter(req, res, next) {
  const ip = parseIp(req);
  const user = req.headers['user-agent'];
  const device = ip.concat(user);
  const userRequests = users.get(device);
  if (
    requestsCounter > requestsPerWindow ||
    userRequests > userRequestsPerWindow
  ) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    const response = `Server is overloaded!`;
    res.end(response);
  } else {
    next(req, res);
  }
  requestsCounter += 1;
  if (Date.now() - frameStart > rateLimiterWindow) {
    users.clear();
    frameStart = Date.now();
    requestsCounter = 0;
  }
  if (!userRequests) {
    users.set(device, 1);
  } else {
    users.set(device, userRequests + 1);
  }
}

module.exports = { rateLimiter };
