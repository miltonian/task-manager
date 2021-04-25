import express from 'express';
import { getRepository, In } from 'typeorm';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { User } from '../entity/User';

const router = express.Router();

/**
 * Login user
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body as UserAPI.User;
  if (!username || !password) {
    return res.status(401).json({ error: 'Username and password required' });
  }
  const userRepo = getRepository(User);
  const user = await userRepo.findOne({ username });
  if (!user) {
    return res.status(400).json({ error: `User doesn't exist` });
  }

  const match = comparePassword(user.password, password);
  if (!match) {
    return res.status(401).json({ error: `Incorrect username and password` });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_TOKEN, {
    expiresIn: '24h',
  });

  res.json({ userId: user.id, token });
});

/**
 * Register new user
 */
router.post('/register', async (req, res) => {
  const { username, password } = req.body as UserAPI.User;
  if (!username || !password) {
    return res.status(401).json({ error: 'Username and password required' });
  }
  const userRepo = getRepository(User);
  const exists = await userRepo.findOne({ username });
  if (exists) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const hashed = hashPassword(password);
  const user = await getRepository(User).save({ username, password: hashed });
  const token = jwt.sign({ userId: user.id }, process.env.JWT_TOKEN, {
    expiresIn: '24h',
  });

  res.json({ userId: user.id, token });
});

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

function comparePassword(hashPassword: string, password: string) {
  return bcrypt.compareSync(password, hashPassword);
}

export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { authorization } = req.headers;
    const token =
      authorization &&
      authorization.split(' ').length > 1 &&
      authorization.split(' ')[1];

    if (!token || !token.length) {
      return res.status(401).json({ error: 'User not authorized' });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
    if (typeof decodedToken === 'object' && 'userId' in decodedToken) {
      const userId = (decodedToken as any).userId! as number;
      const user = await getRepository(User).findOne(userId);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
      next();
      return;
    }
  } catch (error) {
    res.status(401).json({ error: 'User not authorized' });
  }
}

export default router;
