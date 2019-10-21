import Joi from '@hapi/joi';
import authValidation from '../validations/authValidator';
import ServerResponseModule from '../modules/ServerResponse';

const { error } = ServerResponseModule;

class AuthMiddleware {
  static validateRegistration(req, res, next) {
    Joi.validate(
      req.body,
      authValidation.registrationSchema,
      { abortEarly: false },
      err => {
        const errors = {};
        if (err) {
          err.details.forEach(error => {
            const newError = error;
            errors[newError.context.key] = newError.message;
          });
          return error(res, 400, errors);
        }

        return next();
      }
    );
  }

  static validateLogin(req, res, next) {
    Joi.validate(
      req.body,
      authValidation.loginSchema,
      { abortEarly: false },
      err => {
        const errors = {};
        if (err) {
          err.details.forEach(error => {
            const newError = error;
            errors[newError.context.key] = newError.message;
          });
          return error(res, 400, errors);
        }

        return next();
      }
    );
  }
}

export default AuthMiddleware;
