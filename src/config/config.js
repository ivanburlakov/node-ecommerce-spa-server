module.exports = {
  limiter: {
    window: 10000,
    requests: 1000,
    uniqueRequests: 100,
  },
  db: {
    host: '127.0.0.1',
    port: 5432,
    database: 'ecommerce',
    user: 'postgres',
    password: '12qwas',
  },
};
