import request from 'supertest';
import dotenv from 'dotenv';
import app from '..';

dotenv.config();

let adminToken;
const AUTH_BASE_URL = '/api/v1/auth';

describe('Categories Test', () => {
  beforeEach(async () => {
    const res = await request(app)
      .post(`${AUTH_BASE_URL}/login`)
      .send({
        email: 'adminuser1@mockeatery.com',
        password: process.env.ADMIN_PASSWORD
      });
    adminToken = res.body.auth.token;
  });

  it('should create a new category', async (done) => {
    const res = await request(app)
      .post('/api/v1/categories')
      .send({
        categoryName: 'Jollof Rice',
        description: 'J Rice with a twist again'
      })
      .set('Authorizatrion', `Bearer ${adminToken}`);
    expect(res.status).toEqual(201);
    done();
  });
});
