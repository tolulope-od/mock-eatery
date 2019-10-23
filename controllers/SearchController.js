import Recipe from '../models/Recipes';
import Category from '../models/Categories';
import ServerResponseModule from '../modules/ServerResponse';
import isEmpty from '../helpers/isEmpty';
import { redisClient } from '../config/redisConfig';

class SearchController {
  static async searchCategoriesAndRecipes(req, res, next) {
    try {
      const key = req.url.toString();
      redisClient.get(key, async (err, result) => {
        if (result) {
          ServerResponseModule.success(res, 200, 'results', JSON.parse(result));
        } else {
          // prettier-ignore
          const {
            filterBy, searchTerm, limit, page
          } = req.query;

          if (isEmpty(searchTerm)) return ServerResponseModule.error(res, 400, { message: 'Please enter a search term' });

          const itemsPerPage = limit || 10;
          const numOfPages = Math.max(0, page) || 0;

          const recipes = await Recipe.find({ $text: { $search: searchTerm } }, { score: { $meta: 'textScore' } })
            .populate('categoryId', ['categoryName'])
            .limit(parseInt(itemsPerPage, 10))
            .skip(parseInt(itemsPerPage, 10) * parseInt(numOfPages, 10))
            .sort({ score: { $meta: 'textScore' } });

          const categories = await Category.find({ $text: { $search: searchTerm } }, { score: { $meta: 'textScore' } })
            .limit(parseInt(itemsPerPage, 10))
            .skip(parseInt(itemsPerPage, 10) * parseInt(numOfPages, 10))
            .sort({ score: { $meta: 'textScore' } });

          if (filterBy === 'category') {
            redisClient.setex(key, 300, JSON.stringify({ categories }));
            return ServerResponseModule.success(res, 200, 'results', { categories });
          }

          if (filterBy === 'recipe') {
            redisClient.setex(key, 300, JSON.stringify({ recipes }));
            return ServerResponseModule.success(res, 200, 'results', { recipes });
          }

          redisClient.setex(key, 300, JSON.stringify({ categories, recipes }));
          return ServerResponseModule.success(res, 200, 'results', { categories, recipes });
        }
      });
    } catch (err) {
      return next(err);
    }
  }
}

export default SearchController;
