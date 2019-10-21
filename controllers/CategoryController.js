import mongoose from 'mongoose';
import Category from '../models/Categories';
import ServerResponseModule from '../modules/ServerResponse';

const { error, success } = ServerResponseModule;

class CategoryController {
  static async createCategory(req, res, next) {
    try {
      const { categoryName, description } = req.body;
      const existingCategory = await Category.findOne({ categoryName });
      if (existingCategory) {
        return error(res, 409, { category: 'This category already exists' });
      }

      const categoryFields = {};
      categoryFields.createdBy = req.user.id;
      categoryFields.updatedBy = req.user.id;
      categoryFields.categoryName = categoryName;
      categoryFields.description = description;

      const category = await new Category(categoryFields).save();

      return success(res, 201, 'category', category);
    } catch (err) {
      return next(err);
    }
  }

  static async editCategory(req, res, next) {
    try {
      const { categoryName, description } = req.body;
      const validId = mongoose.Types.ObjectId.isValid(req.params.id);
      const existingCategory = await Category.findOne({ _id: id });
      if (!validId || !existingCategory) {
        return error(res, 404, { category: 'That category does not exist' });
      }

      const categoryFields = {};
      categoryFields.updatedBy = req.user.id;
      categoryFields.categoryName = categoryName;
      categoryFields.description = description;
      categoryFields.updatedOn = Date.now();

      const category = await Category.findOneAndUpdate(
        { _id: req.params.id },
        { $set: categoryFields },
        { new: true }
      );

      return success(res, 200, 'category', category);
    } catch (err) {
      return next(err);
    }
  }

  static async viewCategories(req, res, next) {
    try {
      const { limit, page } = req.query;
      const itemsPerPage = limit || 10;
      const numOfPages = Math.max(0, page) || 0;
      const categories = await Category.find()
        .limit(parseInt(itemsPerPage, 10))
        .skip(parseInt(itemsPerPage, 10) * parseInt(numOfPages, 10))
        .sort('-createdOn');
      return success(res, 200, 'categories', categories);
    } catch (err) {
      return next(err);
    }
  }

  static async viewSingleCategory(req, res, next) {
    try {
      const { id } = req.params;
      const validId = mongoose.Types.ObjectId.isValid(id);
      const existingCategory = await Category.findOne({ _id: id });
      if (!validId || !existingCategory) {
        return error(res, 404, { category: 'That category does not exist' });
      }
      const category = await Category.findOne({ _id: id });
      return success(res, 200, 'catgeory', category);
    } catch (err) {
      return next(err);
    }
  }

  static async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      const validId = mongoose.Types.ObjectId.isValid(id);
      const existingCategory = await Category.findOne({ _id: id });
      if (!validId || !existingCategory) {
        return error(res, 404, { category: 'That category does not exist' });
      }

      const deleteCategory = await Category.findOneAndRemove({ _id: id });
      return success(res, 200, 'category', {
        message: 'Category deleted successfully'
      });
    } catch (err) {
      return next(err);
    }
  }
}

export default CategoryController;
