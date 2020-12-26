module.exports = {
  limiter: {
    window: 1000,
    requests: 10000,
    uniqueRequests: 500,
  },
  db: {
    host: '127.0.0.1',
    port: 5432,
    database: 'ecommerce',
    user: 'postgres',
    password: '12qwas',
  },
};
