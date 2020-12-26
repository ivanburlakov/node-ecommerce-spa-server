const fs = require('fs');
const path = require('path');

const { LIGHT_MIME_TYPES, STATIC_PATH } = require('./constants');

const STATIC_PATH_LENGTH = STATIC_PATH.length;

const cache = new Map();

async function serveFile(res, file, mimeType) {
  const cached = cache.get(file);
  if (cached) {
    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(cached);
    return;
  }
  const filePath = path.join(STATIC_PATH, file);
  if (!filePath.startsWith(STATIC_PATH)) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    const response = `Out of static path!`;
    res.end(response);
    return;
  }
  const stream = fs.createReadStream(filePath);
  if (stream) {
    res.writeHead(200, { 'Content-Type': mimeType });
    stream.pipe(res);
  } else {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    const response = `No such file!`;
    res.end(response);
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
