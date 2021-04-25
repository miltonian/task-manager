import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as bodyParser from 'body-parser';
import { URL } from 'url';
import express from 'express';
import { isAuthenticated } from './routes/auth';
const app = express();

require('dotenv').config();

export const dbconnection = createConnection();

app.use(bodyParser.json());

app.use(function (req, res, next) {
  const defaultReferer = 'http://localhost:5000';
  const referer = new URL(req.header('referer') || defaultReferer);
  res.header('Access-Control-Allow-Origin', referer.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use('/api/auth', require('./routes/auth').default);
app.use('/api/task', isAuthenticated, require('./routes/task').default);

export default app;
