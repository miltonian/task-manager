import request from 'supertest';
import { prepareDB } from '../test-helpers';
import app from '../app';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import { hashPassword } from '../routes/auth';

describe('Auth endpoints', () => {
  const USERNAME = 'john.doe';
  const PASSWORD = 'asdf';

  beforeEach(async () => {
    await prepareDB();
  });

  describe('POST /login', () => {
    test('Login user', async () => {
      const userRepo = getRepository(User);
      await userRepo.save({
        username: USERNAME,
        password: hashPassword(PASSWORD),
      });
      const resp = await request(app)
        .post(`/api/auth/login`)
        .send({ username: USERNAME, password: PASSWORD });

      expect(resp.status).toEqual(200);
      expect(resp.body.token).toBeTruthy();
    });

    test('Invalid username/password', async () => {
      const userRepo = getRepository(User);
      await userRepo.save({
        username: USERNAME,
        password: hashPassword(PASSWORD),
      });
      const resp = await request(app)
        .post(`/api/auth/login`)
        .send({ username: USERNAME, password: `${PASSWORD}ASDF` });

      expect(resp.status).toEqual(401);
      expect(resp.body.token).toBeFalsy();
    });

    test('Empty fields', async () => {
      const resp = await request(app)
        .post(`/api/auth/login`)
        .send({ username: '', password: '' });

      expect(resp.status).toEqual(401);
    });
  });

  describe('POST /register', () => {
    test('Register new user', async () => {
      const userRepo = getRepository(User);
      let user = await userRepo.findOne({ username: USERNAME });
      await request(app)
        .post(`/api/auth/register`)
        .send({ username: USERNAME, password: PASSWORD });

      expect(user).toBeFalsy();
      user = await userRepo.findOne({ username: USERNAME });
      expect(user.username).toEqual(USERNAME);
    });

    test('Register existing user', async () => {
      const userRepo = getRepository(User);
      await userRepo.save({
        username: USERNAME,
        password: hashPassword(PASSWORD),
      });
      const resp = await request(app)
        .post(`/api/auth/register`)
        .send({ username: USERNAME, password: PASSWORD });

      expect(resp.status).toEqual(400);
    });

    test('Empty fields', async () => {
      const resp = await request(app)
        .post(`/api/auth/register`)
        .send({ username: '', password: '' });

      expect(resp.status).toEqual(401);
    });
  });
});
