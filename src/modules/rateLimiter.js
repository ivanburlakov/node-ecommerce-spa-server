const users = new Map();
let frameStart = Date.now();
let requestsCounter = 0;

const parseIp = req =>
  (typeof req.headers['x-forwarded-for'] === 'string' &&
    req.headers['x-forwarded-for'].split(',').shift()) ||
  req.connection?.remoteAddress ||
  req.socket?.remoteAddress ||
  req.connection?.socket?.remoteAddress;

async function rateLimiter(req, res, next, window, requests, uniqueRequests) {
  const ip = parseIp(req);
  const user = req.headers['user-agent'];
  const device = ip.concat(':', user);
  const deviceRequests = users.get(device);
  if (requestsCounter > requests || deviceRequests > uniqueRequests) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    const response = `Too much requests!`;
    res.end(response);
  } else {
    next(req, res);
  }
  if (Date.now() - frameStart > window) {
    users.clear();
    frameStart = Date.now();
    requestsCounter = 0;
  }
  requestsCounter += 1;
  users.set(device, !deviceRequests ? 1 : deviceRequests + 1);
}

module.exports = { rateLimiter };
