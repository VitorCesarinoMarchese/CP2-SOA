import { Router } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { StockController } from './stock.controller';

export const buildStockRoutes = (controller: StockController) => {
  const router = Router();

  router.get('/:productId', asyncHandler(controller.getStockByProductId));

  return router;
};
