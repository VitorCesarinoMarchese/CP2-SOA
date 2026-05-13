import { Router } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ProductController } from './product.controller';

export const buildProductRoutes = (controller: ProductController) => {
  const router = Router();

  router.get('/', asyncHandler(controller.listProducts));
  router.get('/:id', asyncHandler(controller.getProductById));

  return router;
};
