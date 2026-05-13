import { Router } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { NotificationController } from './notification.controller';

export const buildNotificationRoutes = (controller: NotificationController) => {
  const router = Router();

  router.get('/', asyncHandler(controller.listNotifications));
  router.get('/order/:orderId', asyncHandler(controller.listByOrderId));

  return router;
};
