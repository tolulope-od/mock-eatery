import { Router } from 'express';
import authRoutes from './authRoutes';

const router = Router();

router.get('/', (req, res) => {
  return res.status(200).json({
    status: 'success',
    message: 'Mock-Eatery API V1 Base Route'
  });
});

router.use('/auth', authRoutes);

export default router;
