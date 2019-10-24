import dotenv from 'dotenv';
import uuid from 'uuid/v4';
import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';
import moment from 'moment';
import Debug from 'debug';

import ServerResponseModule from '../modules/ServerResponse';

dotenv.config();
const debug = Debug('dev');

const redisStore = connectRedis(session);
export const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});

redisClient.on('error', (err) => debug(`Redis error: ${err}`));
redisClient.on('ready', (err) => debug('Redis is ready'));

export const checkRateLimit = (req, res, next) => {
  if (req.session.user) {
    const currentTime = moment().unix();
    const difference = (currentTime - req.session.user.startTime) / 60;
    if (difference >= 1) {
      const body = {
        count: 1,
        startTime: moment().unix()
      };

      req.session.user = { ...body };
      next();
    }

    if (difference < 1) {
      if (req.session.user.count > 3) {
        return ServerResponseModule.error(res, 429, {
          message: 'Throttled limit exceeded. Please wait a moment and try again'
        });
      }
      req.session.user.count++;
      next();
    }
  } else {
    const body = {
      count: 1,
      startTime: moment().unix()
    };
    req.session.user = { ...body };
    next();
  }
};

export default () =>
  session({
    genid: (req) => uuid(),
    store: new redisStore({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      pass: process.env.REDIS_PASSWORD,
      client: redisClient
    }),
    name: '_mockEatery',
    secret: process.env.REDIS_SECRET,
    resave: false,
    cookie: { secure: false, maxAge: 86400000 },
    saveUninitialized: true
  });
