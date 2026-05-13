import { Router } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { OrderController } from './order.controller';

export const buildOrderRoutes = (controller: OrderController) => {
  const router = Router();

  router.post('/', asyncHandler(controller.createOrder));
  router.get('/', asyncHandler(controller.listOrders));
  router.get('/:id', asyncHandler(controller.getOrderById));
  router.patch('/:id/status', asyncHandler(controller.updateOrderStatus));

  return router;
};
