import Joi from '@hapi/joi';
import recipeValidation from '../validations/recipeValidator';
import ServerResponseModule from '../modules/ServerResponse';

class RecipeMiddleware {
  static validateNewRecipe(req, res, next) {
    Joi.validate(req.body, recipeValidation.newRecipeSchema, { abortEarly: false }, (err) => {
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

  static validateEditRecipe(req, res, next) {
    Joi.validate(req.body, recipeValidation.editRecipeSchema, { abortEarly: false }, (err) => {
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
}

export default RecipeMiddleware;
