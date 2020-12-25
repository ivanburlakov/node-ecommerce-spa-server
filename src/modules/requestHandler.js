const fs = require('fs');
const path = require('path');

const { LIGHT_MIME_TYPES, HEAVY_MIME_TYPES } = require('./constants');
const { postTypes, jsonResult } = require('./functions');
const { serveFile } = require('./serveFile.js');

async function getHandler(res, url) {
  const fileExt = path.extname(url).substring(1);
  let mimeType = LIGHT_MIME_TYPES[fileExt] || HEAVY_MIME_TYPES[fileExt];
  if (!mimeType) mimeType = LIGHT_MIME_TYPES.html;
  res.writeHead(200, { 'Content-Type': mimeType });
  const file = fileExt === '' ? '/index.html' : url;
  serveFile(res, file);
}

async function postHandler(req, res, url) {
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
  const { url } = req;
  if (req.method === 'GET') {
    getHandler(res, url);
  } else if (req.method === 'POST') {
    postHandler(req, res, url);
  }
}

module.exports = { requestHandler };
