function jsonResponse(res, code, json) {
  return res
    .writeHead(code || 200, {
      'Content-Type': 'application/json',
    })
    .end(JSON.stringify(json));
}

function streamToString(stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
    stream.on('error', err => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

module.exports = { jsonResponse, streamToString };
