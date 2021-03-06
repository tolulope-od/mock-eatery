import { Router } from 'express';
import RecipeController from '../controllers/RecipeController';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import CartController from '../controllers/CartController';

const router = Router();

router.get('/:slug', AuthMiddleware.authenticateJWT, RecipeController.viewOneRecipe);

router.delete('/:slug', AuthMiddleware.authenticateJWT, AuthMiddleware.allowOnly(['admin', 'superAdmin']), RecipeController.deleteRecipe);

router.patch(
  '/:slug/ingredients/:ingredientId',
  AuthMiddleware.authenticateJWT,
  AuthMiddleware.allowOnly(['admin', 'superAdmin']),
  RecipeController.editIngredient
);

router.delete(
  '/:slug/ingredients/:ingredientId',
  AuthMiddleware.authenticateJWT,
  AuthMiddleware.allowOnly(['admin', 'superAdmin']),
  RecipeController.deleteIngredient
);

router.post('/:slug/cart', AuthMiddleware.authenticateJWT, AuthMiddleware.allowOnly(['regular']), CartController.addRecipeToCart);

export default router;
