const {
  rateLimiterWindow,
  requestsPerWindow,
  userRequestsPerWindow,
} = require('../config/config.js').server;

const users = new Map();
let frameStart = Date.now();
let requestsCounter = 0;

async function rateLimiter(req) {
  const { headers } = req;
  const { host } = headers;
  const user = headers['user-agent'];
  const device = host.concat(user);
  const userRequests = users.get(device);
  if (Date.now() - frameStart > rateLimiterWindow) {
    users.clear();
    frameStart = Date.now();
    requestsCounter = 0;
  }
  if (
    requestsCounter > requestsPerWindow ||
    userRequests > userRequestsPerWindow
  ) {
    return false;
  }
  requestsCounter += 1;
  if (!userRequests) {
    users.set(device, 1);
  } else {
    users.set(device, userRequests + 1);
  }
  return true;
}

module.exports = { rateLimiter };
