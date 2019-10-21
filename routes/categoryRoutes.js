import { Router } from 'express';
import CategoryController from '../controllers/CategoryController';
import AuthMiddleware from '../middlewares/AuthMiddleware';

const router = Router();

router.post(
  '/',
  AuthMiddleware.authenticateJWT,
  AuthMiddleware.allowOnly(['admin', 'superAdmin']),
  CategoryController.createCategory
);
router.patch(
  '/:id',
  AuthMiddleware.authenticateJWT,
  AuthMiddleware.allowOnly(['admin', 'superAdmin']),
  CategoryController.editCategory
);
router.get(
  '/',
  AuthMiddleware.authenticateJWT,
  CategoryController.viewCategories
);
router.get(
  '/:id',
  AuthMiddleware.authenticateJWT,
  CategoryController.viewSingleCategory
);

router.delete(
  '/:id',
  AuthMiddleware.authenticateJWT,
  AuthMiddleware.allowOnly(['admin', 'superAdmin']),
  CategoryController.deleteCategory
);

export default router;
