/* eslint-disable operator-linebreak */
/* eslint-disable max-len */
import Joi from '@hapi/joi';

const ingredientItems = Joi.object().keys({
  name: Joi.string()
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'any.empty':
            err.message = 'Ingredient name is requied';
            break;
          case 'any.required':
            err.message = 'Ingredient name is required';
            break;
          default:
            break;
        }
      });
      return errors;
    }),
  measurement: Joi.string()
    .valid('teaspoon', 'tablespoon', 'cup', 'grams', 'pieces')
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'any.allowOnly':
            err.message = "Invalid measurement type, supported values are 'teaspoon', 'tablespoon', 'cup', 'grams', 'pieces'";
            break;
          default:
            break;
        }
      });
      return errors;
    }),
  quantity: Joi.number()
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'any.empty':
            err.message = 'Quantity is required';
            break;
          case 'any.required':
            err.message = 'Quantity is required';
            break;
          case 'number.base':
            err.message = 'Please enter a valid number';
            break;
          default:
            break;
        }
      });
      return errors;
    })
});

export default {
  newRecipeSchema: {
    recipeName: Joi.string()
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.type) {
            case 'any.empty':
              err.message = 'Recipe name is required';
              break;
            case 'any.required':
              err.message = 'Recipe name is required';
              break;
            default:
              break;
          }
        });
        return errors;
      }),
    recipeIngredients: Joi.array()
      .items(ingredientItems)
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.type) {
            case 'array.base':
              err.message = 'At least one recipe ingredient is required';
              break;
            case 'array.includesOne':
              err.context.key = 'recipeIngredient';
              err.context.reason[0].context.key = 'recipeIngredient';
              err.context.reason[0].message = 'Provide a valid ingredient object with the keys name(string), measurement(string) & quantity(number)';
              err.message = 'Provide a valid ingredient object with the keys name(string), measurement(string) & quantity(number)';
              break;
            default:
              break;
          }
        });
        return errors;
      })
  },
  editRecipeSchema: {
    recipeName: Joi.string().error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'any.empty':
            err.message = 'Recipe name is required';
            break;
          case 'any.required':
            err.message = 'Recipe name is required';
            break;
          default:
            break;
        }
      });
      return errors;
    }),
    recipeIngredients: Joi.array()
      .items(ingredientItems)
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.type) {
            case 'array.base':
              err.message = 'At least one recipe ingredient is required';
              break;
            case 'array.includesOne':
              err.context.key = 'recipeIngredient';
              err.context.reason[0].context.key = 'recipeIngredient';
              err.context.reason[0].message = 'Provide a valid ingredient object with the keys name(string), measurement(string) & quantity(number)';
              err.message = 'Provide a valid ingredient object with the keys name(string), measurement(string) & quantity(number)';
              break;
            default:
              break;
          }
        });
        return errors;
      })
  }
};
