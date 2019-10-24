import '@babel/polyfill';
import express from 'express';
import logger from 'morgan';
import Debug from 'debug';
import dotenv from 'dotenv';
import passport from 'passport';

import passportConfig from './src/config/passportConfig';
import sessionConfig, { checkRateLimit } from './src/config/redisConfig';
import connectToDB from './src/db/config';
import ServerResponseModule from './src/modules/ServerResponse';
import routes from './src/routes';

dotenv.config();

const API_V1 = '/api/v1';
const PORT = process.env.PORT || 5000;
const debug = Debug('dev');
const { resourceNotFound, serverError, serverErrorWithStackTrace } = ServerResponseModule;
const isProduction = process.env.NODE_ENV === 'production';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(sessionConfig());
app.use(checkRateLimit);
app.use(API_V1, routes);
passportConfig(passport);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Mock-Eats'
  });
});

app.use(resourceNotFound);

if (!isProduction) app.use(serverErrorWithStackTrace);

app.use(serverError);

(async () => {
  try {
    await connectToDB();
  } catch (err) {
    debug(err);
  }
})();

const isTest = process.env.NODE_ENV === 'test';

if (!isTest) {
  app.listen(PORT, () => {
    debug(`Server running on port:${PORT}`);
  });
}

export default app;
