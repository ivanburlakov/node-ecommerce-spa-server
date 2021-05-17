const { Readable } = require('stream');
const { apis } = require('../src/services/functions');

describe('Registration test', () => {
  it('should test that registering a user goes successfuly', () => {
    const req = new Readable();
    req._read = () => { /* do nothing */ };
    const user = {
      email: 'email@email.com',
      password: '555555',
    };
    apis['/api/register'](req);
    req.emit('data', encodeURI(JSON.stringify(user)));
    req.emit('end');
  });
});
