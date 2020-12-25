const fs = require('fs');
const path = require('path');

const { LIGHT_MIME_TYPES } = require('./constants');

const STATIC_PATH = path.join(process.cwd(), './public');
const STATIC_PATH_LENGTH = STATIC_PATH.length;

const cache = new Map();

async function serveFile(res, file) {
  const cached = cache.get(file);
  if (cached) {
    res.end(cached);
  } else {
    const filePath = path.join(STATIC_PATH, file);
    if (!filePath.startsWith(STATIC_PATH)) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      const response = `Out of static path!`;
      res.end(response);
    } else {
      const stream = fs.createReadStream(filePath);
      // TODO: add logging
      if (stream) stream.pipe(res);
    }
  }
}

async function cacheFile(filePath) {
  const data = await fs.promises.readFile(filePath, 'utf8');
  // .split and .join are only for hosting on Windows
  const key = filePath
    .substring(STATIC_PATH_LENGTH)
    .split(path.sep)
    .join(path.posix.sep);
  cache.set(key, data);
}

async function cacheDirectory(directoryPath) {
  const files = await fs.promises.readdir(directoryPath, {
    withFileTypes: true,
  });
  for (const file of files) {
    const filePath = path.join(directoryPath, file.name);
    const fileExt = path.extname(filePath).substring(1);
    if (file.isDirectory()) cacheDirectory(filePath);
    else if (LIGHT_MIME_TYPES[fileExt]) cacheFile(filePath);
  }
}

cacheDirectory(STATIC_PATH);

module.exports = { serveFile };
