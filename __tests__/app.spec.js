import request from 'supertest';
import mongoose from 'mongoose';
import app from '..';

describe('App base URL test', () => {
  afterAll(() => mongoose.connection.close());
  it('should return response object with a message', async (done) => {
    const res = await request(app).get('/');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Welcome to Mock-Eats');
    done();
  });
});
