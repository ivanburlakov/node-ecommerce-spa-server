const crypto = require('crypto');
const { promisify } = require('util');

const scrypt = promisify(crypto.scrypt);

async function hash(password) {
  const salt = crypto.randomBytes(8).toString('hex');
  const derivedKey = await scrypt(password, salt, 64);
  return salt.concat(':', derivedKey.toString('hex'));
}

async function verify(password, hashedPassword) {
  const [salt, key] = hashedPassword.split(':');
  const keyBuffer = Buffer.from(key, 'hex');
  const derivedKey = await scrypt(password, salt, 64);
  return crypto.timingSafeEqual(keyBuffer, derivedKey);
}

module.exports = { hash, verify };
