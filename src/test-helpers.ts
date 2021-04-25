import { getRepository } from 'typeorm';
import { dbconnection } from './app';
import { User } from './entity/User';
import { hashPassword } from './routes/auth';
import jwt from 'jsonwebtoken';

export const prepareDB = async () => {
  await dbconnection;

  await (await dbconnection).query(`
    DELETE FROM "task";
    DELETE FROM "user";
    `);
};

const TEST_PASSWORD = 'asdf';

export const createAuthenticatedUser = async () => {
  const userA = await getRepository(User).save({
    username: 'userA',
    password: hashPassword(TEST_PASSWORD),
  });

  const token = jwt.sign({ userId: userA.id }, process.env.JWT_TOKEN, {
    expiresIn: '24h',
  });

  return { userA, token };
};
