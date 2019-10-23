/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import Recipe from '../models/Recipes';
import Category from '../models/Categories';
import ServerResponseModule from '../modules/ServerResponse';
import Slug from '../helpers/Slugify';
import isEmpty from '../helpers/isEmpty';

const { error, success } = ServerResponseModule;

class RecipeController {
  static async createRecipe(req, res, next) {
    try {
      const { recipeName, recipeIngredients } = req.body;
      const { categoryId } = req.params;

      const validId = mongoose.Types.ObjectId.isValid(categoryId);
      const existingCategory = await Category.findOne({ _id: categoryId });
      const existingRecipe = await Recipe.findOne({ recipeName });

      if (!validId || !existingCategory) {
        return error(res, 404, {
          category: 'That category does not exist'
        });
      }

      if (existingRecipe) {
        return error(res, 409, {
          recipe: 'That recipe already exists'
        });
      }

      const slug = new Slug(recipeName).generateUniqueSlug();

      const recipeFields = {
        recipeName,
        slug,
        categoryId,
        createdBy: req.user.id,
        updatedBy: req.user.id,
        ingredients: []
      };

      recipeIngredients.forEach((recipeIngredient) => recipeFields.ingredients.push(recipeIngredient));

      const recipe = await new Recipe(recipeFields).save();

      return success(res, 201, 'recipe', recipe);
    } catch (err) {
      return next(err);
    }
  }

  static async editRecipe(req, res, next) {
    try {
      const { recipeName, recipeIngredients } = req.body;
      const { categoryId, slug } = req.params;

      // TODO: Abstract all these checks
      const validId = mongoose.Types.ObjectId.isValid(categoryId);
      const existingCategory = await Category.findOne({ _id: categoryId });
      const existingRecipeName = await Recipe.findOne({ recipeName });
      const foundRecipe = await Recipe.findOne({ slug });

      if (!validId || !existingCategory) {
        return error(res, 404, {
          category: 'That category does not exist'
        });
      }

      if (!foundRecipe) {
        return error(res, 404, {
          category: 'That recipe does not exist'
        });
      }

      if (existingRecipeName) {
        return error(res, 409, {
          recipe: 'A recipe with that name already exists'
        });
      }

      const updatedRecipe = foundRecipe;
      if (!isEmpty(recipeIngredients)) {
        recipeIngredients.forEach((ingredient) => updatedRecipe.ingredients.push(ingredient));
      }

      updatedRecipe.recipeName = recipeName;
      updatedRecipe.updatedBy = req.user.id;
      updatedRecipe.updatedOn = Date.now();

      const recipe = await Recipe.findOneAndUpdate({ slug }, { $set: updatedRecipe }, { new: true });

      return success(res, 200, 'recipe', recipe);
    } catch (err) {
      return next(err);
    }
  }

  static async viewRecipesByCategory(req, res, next) {
    try {
      const { categoryId } = req.params;
      const { limit, page } = req.query;
      const validId = mongoose.Types.ObjectId.isValid(categoryId);
      const existingCategory = await Category.findOne({ _id: categoryId });

      if (!validId || !existingCategory) {
        return error(res, 404, {
          category: 'That category does not exist'
        });
      }

      const itemsPerPage = limit || 10;
      const numOfPages = Math.max(0, page) || 0;

      const recipes = await Recipe.find({ categoryId })
        .limit(parseInt(itemsPerPage, 10))
        .skip(parseInt(itemsPerPage, 10) * parseInt(numOfPages, 10))
        .sort('-createdOn');

      return success(res, 200, 'recipes', recipes);
    } catch (err) {
      return next(err);
    }
  }

  static async viewOneRecipe(req, res, next) {
    try {
      const { slug } = req.params;
      const recipe = await Recipe.findOne({ slug }).populate('categoryId', ['categoryName']);

      if (isEmpty(recipe)) {
        return error(res, 404, { recipe: 'Recipe not found' });
      }

      return success(res, 200, 'recipe', recipe);
    } catch (err) {
      return next(err);
    }
  }

  static async deleteRecipe(req, res, next) {
    try {
      const { slug } = req.params;
      const foundRecipe = await Recipe.findOne({ slug });

      if (isEmpty(foundRecipe)) {
        return error(res, 404, { recipe: 'Recipe not found' });
      }

      await Recipe.findOneAndRemove({ slug });

      return success(res, 200, 'recipe', { messagge: 'Recipe removed successfuly' });
    } catch (err) {
      return next(err);
    }
  }

  static async editIngredient(req, res, next) {
    try {
      const { slug, ingredientId } = req.params;
      const { recipeIngredients } = req.body;

      const validId = mongoose.Types.ObjectId.isValid(ingredientId);

      const foundRecipe = await Recipe.findOne({ slug });

      if (isEmpty(foundRecipe) || !validId) {
        return error(res, 404, { recipe: 'Recipe not found' });
      }

      const ingredientToEdit = foundRecipe.ingredients.filter((ingredient) => ingredient._id.toString() === ingredientId);

      if (isEmpty(ingredientToEdit)) {
        return error(res, 404, { recipe: 'No ingredient with the provided ID was found' });
      }

      const ingredientItem = foundRecipe.ingredients.id(ingredientId);
      ingredientItem.name = recipeIngredients.name;
      ingredientItem.measurement = recipeIngredients.measurement;
      ingredientItem.quantity = recipeIngredients.quantity;
      foundRecipe.updatedOn = Date.now();
      foundRecipe.updatedBy = req.user.id;
      await foundRecipe.save();

      return success(res, 200, 'recipe', foundRecipe);
    } catch (err) {
      return next(err);
    }
  }

  static async deleteIngredient(req, res, next) {
    try {
      const { slug, ingredientId } = req.params;

      const validId = mongoose.Types.ObjectId.isValid(ingredientId);

      const recipe = await Recipe.findOne({ slug });

      if (isEmpty(recipe) || !validId) {
        return error(res, 404, { recipe: 'Recipe not found' });
      }

      const ingredientToDelete = recipe.ingredients.filter((ingredient) => ingredient._id.toString() === ingredientId);
      if (isEmpty(ingredientToDelete)) {
        return error(res, 404, { recipe: 'No ingredient with the provided ID was found' });
      }

      const removeIndex = recipe.ingredients.map((ingredient) => ingredient._id.toString()).indexOf(ingredientId);
      recipe.ingredients.splice(removeIndex, 1);
      recipe.updatedOn = Date.now();
      recipe.updatedBy = req.user.id;
      await recipe.save();

      return success(res, 200, 'recipe', { message: 'Ingredient deleted successfully', recipe });
    } catch (err) {
      return next(err);
    }
  }
}

export default RecipeController;
