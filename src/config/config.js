module.exports = {
  db: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
  rateLimiter: {
    window: 10000,
    requests: 1000,
    uniqueRequests: 20,
  }
};
