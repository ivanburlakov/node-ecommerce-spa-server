module.exports = {
  server: {
    rateLimiterWindow: 1000,
    requestsPerWindow: 10000,
    userRequestsPerWindow: 500,
  },
  db: {
    host: '127.0.0.1',
    port: 5432,
    database: 'ecommerce',
    user: 'postgres',
    password: '12qwas',
  },
};
