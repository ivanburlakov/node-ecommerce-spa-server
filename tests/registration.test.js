const http = require('http');
const request = require('supertest');
const { requestHandler } = require('../src/modules/requestHandler');

describe('Registration test', () => {
  it('should test that registering a user goes successfuly', async () => {
    const result = await request(
      http.createServer(async (req, res) => {
        requestHandler(req, res);
      })
    )
      .post('/api/register')
      .send({
        email: 'email@email.com',
        password: '555555',
      });
    expect(result.statusCode).not.toEqual(500);
  });
});
