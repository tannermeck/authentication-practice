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
        expect(response.body).toEqual({ id: '1', email: 'tanner@alchemy.com' });
      });
  });

  it('if the same email already exists, a 400 message is sent', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ email: 'tanner@alchemy.com', password: '123' });
    return request(app)
      .post('/api/auth/signup')
      .send({ email: 'tanner@alchemy.com', password: '456' })
      .then((response) => {
        expect(response.status).toEqual(400);
      });
  });

  it('logs in to the existing user with a response of the user id', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ email: 'tanner1@alchemy1.com', password: '123' });
    await request(app)
      .post('/api/auth/signup')
      .send({ email: 'tanner2@alchemy2.com', password: '456' });
    await request(app)
      .post('/api/auth/signup')
      .send({ email: 'tanner3@alchemy3.com', password: '789' });
    return request(app)
      .post('/api/auth/login')
      .send({ email: 'tanner3@alchemy3.com', password: '789' })
      .then((response) => {
        expect(response.body).toEqual({ id: '3', email: 'tanner3@alchemy3.com' });
      });
  });
  it('invalid login components resulting in message stating email/password incorrect', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ email: 'tanner1@alchemy1.com', password: '123' });
    await request(app)
      .post('/api/auth/signup')
      .send({ email: 'tanner2@alchemy2.com', password: '456' });
    await request(app)
      .post('/api/auth/signup')
      .send({ email: 'tanner3@alchemy3.com', password: '789' });
    return request(app)
      .post('/api/auth/login')
      .send({ email: 'tanner3@alchemy3.com', password: '123' })
      .then((response) => {
        expect(response.body.message).toEqual('Invalid email/password');
      });
  });
  it('invalid login components resulting in an error of 401', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ email: 'tanner1@alchemy1.com', password: '123' });
    await request(app)
      .post('/api/auth/signup')
      .send({ email: 'tanner2@alchemy2.com', password: '456' });
    await request(app)
      .post('/api/auth/signup')
      .send({ email: 'tanner3@alchemy3.com', password: '789' });
    return request(app)
      .post('/api/auth/login')
      .send({ email: 'tanner3@alchemy3.com', password: '123' })
      .then((response) => {
        expect(response.status).toEqual(401);
      });
  });
  it('invalid email resulting in message stating email/password incorrect', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ email: 'tanner1@alchemy1.com', password: '123' });
    await request(app)
      .post('/api/auth/signup')
      .send({ email: 'tanner2@alchemy2.com', password: '456' });
    await request(app)
      .post('/api/auth/signup')
      .send({ email: 'tanner3@alchemy3.com', password: '789' });
    return request(app)
      .post('/api/auth/login')
      .send({ email: 'tanner@alchemy3.com', password: '789' })
      .then((response) => {
        expect(response.body.message).toEqual('Invalid email/password');
      });
  });
  it('logs in to the existing user with a response of the users cookie', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ email: 'tanner3@alchemy3.com', password: '789' });
    return request(app)
      .post('/api/auth/login')
      .send({ email: 'tanner3@alchemy3.com', password: '789' })
      .then((response) => {
        const cookie = response.headers['set-cookie'];
        const [userCookie] = cookie.map(item => item.split('; '));
        expect(userCookie[0]).toEqual('userId=1');
      });
  });
  it('should return a user id for the current logged in user', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/signup')
      .send({ email: 'tanner3@alchemy3.com', password: '789' });
    await agent.post('/api/auth/login')
      .send({ email: 'tanner3@alchemy3.com', password: '789' });
    const response = await agent
      .get('/api/auth/me');
    expect(response.body).toEqual({ id: '1', email: 'tanner3@alchemy3.com' });
  });

  afterAll(() => {
    pool.end();
  });
});
