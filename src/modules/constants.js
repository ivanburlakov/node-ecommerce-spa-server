const path = require('path');

const STATIC_PATH = path.join(process.cwd(), './build');
const ENV = path.join(process.cwd(), './.env');
const ENV_PRODUCTION = path.join(process.cwd(), './.env.production');

const LIGHT_MIME_TYPES = {
  html: 'text/html; charset=UTF-8',
  js: 'application/javascript; charset=UTF-8',
  css: 'text/css',
};

const HEAVY_MIME_TYPES = {
  json: 'application/json; charset=UTF-8',
  ico: 'image/x-icon',
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
};

module.exports = {
  STATIC_PATH,
  LIGHT_MIME_TYPES,
  HEAVY_MIME_TYPES,
  ENV,
  ENV_PRODUCTION,
};
