import { Router } from 'express';
import CategoryController from '../controllers/CategoryController';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import RecipeMiddleware from '../middlewares/RecipeMiddleware';
import RecipeController from '../controllers/RecipeController';

const router = Router();

router.post('/', AuthMiddleware.authenticateJWT, AuthMiddleware.allowOnly(['admin', 'superAdmin']), CategoryController.createCategory);
router.patch('/:id', AuthMiddleware.authenticateJWT, AuthMiddleware.allowOnly(['admin', 'superAdmin']), CategoryController.editCategory);
router.get('/', AuthMiddleware.authenticateJWT, CategoryController.viewCategories);
router.get('/:id', AuthMiddleware.authenticateJWT, CategoryController.viewSingleCategory);

router.delete('/:id', AuthMiddleware.authenticateJWT, AuthMiddleware.allowOnly(['admin', 'superAdmin']), CategoryController.deleteCategory);

router.post(
  '/:categoryId/recipes',
  AuthMiddleware.authenticateJWT,
  AuthMiddleware.allowOnly(['admin', 'superAdmin']),
  RecipeMiddleware.validateNewRecipe,
  RecipeController.createRecipe
);

router.patch(
  '/:categoryId/recipes/:slug',
  AuthMiddleware.authenticateJWT,
  AuthMiddleware.allowOnly(['admin', 'superAdmin']),
  RecipeMiddleware.validateEditRecipe,
  RecipeController.editRecipe
);
router.get('/:categoryId/recipes', AuthMiddleware.authenticateJWT, RecipeController.viewRecipesByCategory);
export default router;
