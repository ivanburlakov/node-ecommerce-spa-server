const users = new Map();
let frameStart = Date.now();
let requestsCounter = 0;

async function rateLimiter(req) {
  const { headers } = req;
  const { host } = headers;
  const user = headers['user-agent'];
  const device = host.concat(user);
  const requests = users.get(device);
  if (Date.now() - frameStart > 1000) {
    users.clear();
    frameStart = Date.now();
    requestsCounter = 0;
  }
  if (requestsCounter > 10000 || requests > 100) {
    return false;
  }
  requestsCounter += 1;
  if (!requests) {
    users.set(device, 1);
  } else {
    users.set(device, requests + 1);
  }
  return true;
}

module.exports = { rateLimiter };
