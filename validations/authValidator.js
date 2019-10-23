import Joi from '@hapi/joi';

export default {
  registrationSchema: {
    firstName: Joi.string()
      .min(3)
      .max(30)
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.type) {
            case 'any.empty':
              err.message = 'First name is required';
              break;
            case 'any.required':
              err.message = 'First name is required';
              break;
            case 'string.min':
              err.message = `First name should not be less than ${err.context.limit} characters!`;
              break;
            case 'string.max':
              err.message = `First name should not be more than ${err.context.limit} characters!`;
              break;
            default:
              break;
          }
        });
        return errors;
      }),
    lastName: Joi.string()
      .min(3)
      .max(30)
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.type) {
            case 'any.empty':
              err.message = 'Last name is required';
              break;
            case 'any.required':
              err.message = 'Last name is required';
              break;
            case 'string.min':
              err.message = `Last name should not be less than ${err.context.limit} characters!`;
              break;
            case 'string.max':
              err.message = `Last name should not be more than ${err.context.limit} characters!`;
              break;
            default:
              break;
          }
        });
        return errors;
      }),
    password: Joi.string()
      .min(7)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/)
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.type) {
            case 'any.empty':
              err.message = 'Password is required';
              break;
            case 'any.required':
              err.message = 'Password is required';
              break;
            case 'string.min':
              err.message = `Password must not be less than ${err.context.limit} characters and must contain at least one number`;
              break;
            case 'string.regex.base':
              err.message = 'Password at least one uppercase, one lowercase and one number e.g Coolpassword1000';
              break;
            default:
              break;
          }
        });
        return errors;
      }),
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.type) {
            case 'any.empty':
              err.message = 'Email is required';
              break;
            case 'any.required':
              err.message = 'Email is required';
              break;
            case 'string.email':
              err.message = 'Please input a valid email e.g somename@somedomain.com';
              break;
            default:
              break;
          }
        });
        return errors;
      })
  },
  loginSchema: {
    email: Joi.string()
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.type) {
            case 'any.empty':
              err.message = 'email is required';
              break;
            case 'any.required':
              err.message = 'email address is required';
              break;
            default:
              break;
          }
        });
        return errors;
      }),
    password: Joi.string()
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.type) {
            case 'any.empty':
              err.message = 'Password is required';
              break;
            case 'any.required':
              err.message = 'Password is required';
              break;
            default:
              break;
          }
        });
        return errors;
      })
  }
};
