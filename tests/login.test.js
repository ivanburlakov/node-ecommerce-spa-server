const http = require('http');
const request = require('supertest');
const { requestHandler } = require('../src/modules/requestHandler');

describe('Login test', () => {
  it('should test that logging in a user goes successfuly', async () => {
    const result = await request(
      http.createServer(async (req, res) => {
        requestHandler(req, res);
      })
    )
      .post('/api/login')
      .send({
        email: 'email@email.com',
        password: '555555',
      });
    expect(result.statusCode).not.toEqual(500);
  });
});
