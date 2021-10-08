const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');

describe('authentication practice routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('should post a user using /signup route', async () => {
    return request(app)
      .post('/api/auth/signup')
      .send({ email: 'tanner@alchemy.com', password: 'password' })
      .then((response) => {
        expect(response.body).toEqual({ id: '1' });
      });
  });

  afterAll(() => {
    pool.end();
  });
});
