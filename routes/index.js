/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable function-paren-newline */
import { Router } from 'express';
import authRoutes from './authRoutes';
import categoryRoutes from './categoryRoutes';
import recipeRoutes from './recipeRoutes';
import searchRoutes from './searchRoutes';

const router = Router();

router.get('/', (req, res) =>
  res.status(200).json({
    status: 'success',
    message: 'Mock-Eatery API V1 Base Route'
  })
);

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/recipes', recipeRoutes);
router.use('/search', searchRoutes);

export default router;
