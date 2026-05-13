import { Router } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { CustomerController } from './customer.controller';

export const buildCustomerRoutes = (controller: CustomerController) => {
  const router = Router();

  router.get('/', asyncHandler(controller.listCustomers));
  router.get('/:id', asyncHandler(controller.getCustomerById));

  return router;
};
