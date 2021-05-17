const http = require('http');
const request = require('supertest');
const { requestHandler } = require('../src/modules/requestHandler');

describe('Order test', () => {
  it('should test that making an order goes successfuly', async () => {
    const result = await request(
      http.createServer(async (req, res) => {
        requestHandler(req, res);
      })
    )
      .post('/api/order')
      .send({
        email: 'email@email.com',
        deliveryOptionID: 1,
        deliveryAddress: 'Test Address 5',
        orderItems: [
          { id: 1, quantity: 5 },
          { id: 6, quantity: 1 },
        ],
      });
    expect(result.statusCode).not.toEqual(500);
  });
});
