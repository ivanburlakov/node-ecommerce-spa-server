const dotenv = require('dotenv');

if (!process.env.DATABASE_URL) {
  dotenv.config({ path: '.env.test' });
}
