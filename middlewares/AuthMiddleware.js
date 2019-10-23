import Joi from '@hapi/joi';
import passport from 'passport';
import authValidation from '../validations/authValidator';
import ServerResponseModule from '../modules/ServerResponse';

class AuthMiddleware {
  static validateRegistration(req, res, next) {
    Joi.validate(req.body, authValidation.registrationSchema, { abortEarly: false }, (err) => {
      const errors = {};
      if (err) {
        err.details.forEach((error) => {
          const newError = error;
          errors[newError.context.key] = newError.message;
        });
        return ServerResponseModule.error(res, 400, errors);
      }

      return next();
    });
  }

  static validateLogin(req, res, next) {
    Joi.validate(req.body, authValidation.loginSchema, { abortEarly: false }, (err) => {
      const errors = {};
      if (err) {
        err.details.forEach((error) => {
          const newError = error;
          errors[newError.context.key] = newError.message;
        });
        return ServerResponseModule.error(res, 400, errors);
      }

      return next();
    });
  }

  static authenticateJWT(req, res, next) {
    // eslint-disable-next-line no-unused-vars
    passport.authenticate('jwt', (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return ServerResponseModule.error(res, 401, {
          message: 'Unauthorized access, please check credentials and try again'
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  }

  static allowOnly(allowedUsers) {
    return (req, res, next) => {
      const { userType } = req.user;
      if (allowedUsers.includes(userType)) {
        return next();
      }

      return ServerResponseModule.error(res, 403, { permissions: 'You are not allowed to do that' });
    };
  }
}

export default AuthMiddleware;
