import { Router } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { PaymentController } from './payment.controller';

export const buildPaymentRoutes = (controller: PaymentController) => {
  const router = Router();

  router.get('/', asyncHandler(controller.listPayments));
  router.get('/order/:orderId', asyncHandler(controller.getPaymentByOrderId));

  return router;
};
