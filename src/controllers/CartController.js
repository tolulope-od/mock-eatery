import Cart from '../models/Cart';
import Recipe from '../models/Recipes';
import ServerResponseModule from '../modules/ServerResponse';
import isEmpty from '../helpers/isEmpty';

class RecipeController {
  static async addRecipeToCart(req, res, next) {
    try {
      const { slug } = req.params;
      const recipe = await Recipe.findOne({ slug });

      if (isEmpty(recipe)) return ServerResponseModule.error(res, 404, { message: 'No recipe with that ID was found' });

      const cart = new Cart({
        recipeCount: 1,
        recipes: [recipe],
        userId: req.user.id
      });

      await cart.save();

      return ServerResponseModule.success(res, 201, 'cart', cart);
    } catch (err) {
      return next(err);
    }
  }
}

export default RecipeController;
