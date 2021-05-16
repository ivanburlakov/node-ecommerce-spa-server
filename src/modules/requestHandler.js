const path = require('path');
const {
  window,
  requests,
  uniqueRequests,
} = require('../config/config.js').rateLimiter;
const { LIGHT_MIME_TYPES, HEAVY_MIME_TYPES } = require('./constants');
const { apis } = require('../services/functions');
const { serveFile } = require('./serveFile');
const { rateLimiter } = require('./rateLimiter');

async function getHandler(req, res) {
  const { url } = req;
  const api = apis[url];
  if (api) {
    api(req, res);
  } else {
    const fileExt = path.extname(url).substring(1);
    let mimeType = LIGHT_MIME_TYPES[fileExt] || HEAVY_MIME_TYPES[fileExt];
    if (!mimeType) mimeType = LIGHT_MIME_TYPES.html;
    const file = fileExt === '' ? '/index.html' : url;
    serveFile(res, file, mimeType);
  }
}

async function postHandler(req, res) {
  const { url } = req;
  const api = apis[url];
  if (api) {
    api(req, res);
  } else {
    res.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    res.end(`Woops, no "${url}" post type!`);
  }
}

async function requestHandler(req, res) {
  if (req.method === 'GET') {
    getHandler(req, res);
  } else if (req.method === 'POST') {
    rateLimiter(req, res, postHandler, window, requests, uniqueRequests);
  }
}

module.exports = { requestHandler };
