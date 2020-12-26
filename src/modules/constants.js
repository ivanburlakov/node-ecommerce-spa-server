const path = require('path');

const STATIC_PATH = path.join(process.cwd(), './public');

const LIGHT_MIME_TYPES = {
  html: 'text/html; charset=UTF-8',
  js: 'application/javascript; charset=UTF-8',
  css: 'text/css',
  json: 'application/json; charset=UTF-8',
  ico: 'image/x-icon',
  svg: 'image/svg+xml',
};

const HEAVY_MIME_TYPES = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
};

module.exports = {
  STATIC_PATH,
  LIGHT_MIME_TYPES,
  HEAVY_MIME_TYPES,
};
