import { Strategy, ExtractJwt } from 'passport-jwt';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Debug from 'debug';

import User from '../models/User';

dotenv.config();

const debug = Debug('dev');

// const User = mongoose.model('users');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_OR_KEY;

export default passport => {
  passport.use(
    new Strategy(opts, async (jwtPayload, done) => {
      try {
        const user = await User.findById(jwtPayload._id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
        debug(err);
      }
    })
  );
};
