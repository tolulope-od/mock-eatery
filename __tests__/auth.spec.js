import request from 'supertest';
import app from '..';
// prettier-ignore
import {
  validUserSignUp, emptyFirstNameSignUp, emptyLastNameSignUp, wronglyFormattedPassword, emptyEmailSignUp
} from '../__mocks__/auth.mock';

const AUTH_BASE_URL = '/api/v1/auth';

describe('User authentication tests', () => {
  it('should let a new user register successflly', async (done) => {
    const res = await request(app)
      .post(`${AUTH_BASE_URL}/register`)
      .send(validUserSignUp);
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('auth');
    expect(res.body.auth).toHaveProperty('message');
    expect(res.body.status).toEqual('success');
    expect(res.body.auth).toHaveProperty('token');
    done();
  });

  it('should not let a user without a first name register', async (done) => {
    const res = await request(app)
      .post(`${AUTH_BASE_URL}/register`)
      .send(emptyFirstNameSignUp);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveProperty('firstName');
    expect(res.body.status).toEqual('error');
    expect(res.body.errors.firstName).toEqual('First name should not be less than 3 characters!');
    done();
  });

  it('should not let a user without a last name register', async (done) => {
    const res = await request(app)
      .post(`${AUTH_BASE_URL}/register`)
      .send(emptyLastNameSignUp);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveProperty('lastName');
    expect(res.body.status).toEqual('error');
    expect(res.body.errors.lastName).toEqual('Last name should not be less than 3 characters!');
    done();
  });

  it('should not let a user without a valid password register', async (done) => {
    const res = await request(app)
      .post(`${AUTH_BASE_URL}/register`)
      .send(wronglyFormattedPassword);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveProperty('password');
    expect(res.body.status).toEqual('error');
    expect(res.body.errors.password).toEqual('Password at least one uppercase, one lowercase and one number e.g Coolpassword1000');
    done();
  });

  it('should not let a user without an email register', async (done) => {
    const res = await request(app)
      .post(`${AUTH_BASE_URL}/register`)
      .send(emptyEmailSignUp);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveProperty('email');
    expect(res.body.status).toEqual('error');
    expect(res.body.errors.email).toEqual('Please input a valid email e.g somename@somedomain.com');
    done();
  });

  it('should let an existing user log in and return a token', async (done) => {
    const res = await request(app)
      .post(`${AUTH_BASE_URL}/login`)
      .send({
        email: validUserSignUp.email,
        password: validUserSignUp.password
      });
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('auth');
    expect(res.body.auth).toHaveProperty('message');
    expect(res.body.status).toEqual('success');
    expect(res.body.auth).toHaveProperty('token');
    done();
  });
});
