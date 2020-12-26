const path = require('path');

const { LIGHT_MIME_TYPES, HEAVY_MIME_TYPES } = require('./constants');
const { postTypes, jsonResult } = require('./functions');
const { serveFile } = require('./serveFile');
const { rateLimiter } = require('./rateLimiter');

async function getHandler(req, res) {
  const { url } = req;
  const fileExt = path.extname(url).substring(1);
  let mimeType = LIGHT_MIME_TYPES[fileExt] || HEAVY_MIME_TYPES[fileExt];
  if (!mimeType) mimeType = LIGHT_MIME_TYPES.html;
  const file = fileExt === '' ? '/index.html' : url;
  serveFile(res, file, mimeType);
}

async function postHandler(req, res) {
  const { url } = req;
  const postType = postTypes[url];
  let response = postType
    ? await postType(req)
    : jsonResult(`Woops, no ${url} post type!`);
  res.writeHead(response ? 200 : 500, {
    'Content-Type': LIGHT_MIME_TYPES.json,
  });
  if (!response)
    response = jsonResult(`Woops, your response failed to arrive!`);
  res.end(response);
}

async function requestHandler(req, res) {
  if (req.method === 'GET') {
    getHandler(req, res);
  } else if (req.method === 'POST') {
    rateLimiter(req, res, postHandler);
  }
}

module.exports = { requestHandler };
