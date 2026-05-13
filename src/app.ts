import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from './shared/middlewares/errorHandler';
import { CustomerRepository } from './modules/customers/customer.repository';
import { CustomerService } from './modules/customers/customer.service';
import { CustomerController } from './modules/customers/customer.controller';
import { buildCustomerRoutes } from './modules/customers/customer.routes';
import { ProductRepository } from './modules/products/product.repository';
import { ProductService } from './modules/products/product.service';
import { ProductController } from './modules/products/product.controller';
import { buildProductRoutes } from './modules/products/product.routes';
import { StockRepository } from './modules/stock/stock.repository';
import { StockService } from './modules/stock/stock.service';
import { StockController } from './modules/stock/stock.controller';
import { buildStockRoutes } from './modules/stock/stock.routes';
import { PaymentRepository } from './modules/payments/payment.repository';
import { PaymentService } from './modules/payments/payment.service';
import { PaymentController } from './modules/payments/payment.controller';
import { buildPaymentRoutes } from './modules/payments/payment.routes';
import { NotificationRepository } from './modules/notifications/notification.repository';
import { NotificationService } from './modules/notifications/notification.service';
import { NotificationController } from './modules/notifications/notification.controller';
import { buildNotificationRoutes } from './modules/notifications/notification.routes';
import { OrderRepository } from './modules/orders/order.repository';
import { OrderService } from './modules/orders/order.service';
import { OrderController } from './modules/orders/order.controller';
import { buildOrderRoutes } from './modules/orders/order.routes';

export const buildApp = (prisma: PrismaClient) => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const customerRepository = new CustomerRepository(prisma);
  const productRepository = new ProductRepository(prisma);
  const stockRepository = new StockRepository(prisma);
  const paymentRepository = new PaymentRepository(prisma);
  const notificationRepository = new NotificationRepository(prisma);
  const orderRepository = new OrderRepository(prisma);

  const customerService = new CustomerService(customerRepository);
  const productService = new ProductService(productRepository);
  const stockService = new StockService(stockRepository, productRepository);
  const paymentService = new PaymentService(paymentRepository);
  const notificationService = new NotificationService(notificationRepository);
  const orderService = new OrderService(
    orderRepository,
    customerService,
    productService,
    stockService,
    paymentService,
    notificationService
  );

  const customerController = new CustomerController(customerService);
  const productController = new ProductController(productService);
  const stockController = new StockController(stockService);
  const paymentController = new PaymentController(paymentService);
  const notificationController = new NotificationController(notificationService);
  const orderController = new OrderController(orderService);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/customers', buildCustomerRoutes(customerController));
  app.use('/products', buildProductRoutes(productController));
  app.use('/stock', buildStockRoutes(stockController));
  app.use('/payments', buildPaymentRoutes(paymentController));
  app.use('/notifications', buildNotificationRoutes(notificationController));
  app.use('/orders', buildOrderRoutes(orderController));

  app.use((_req, res) => {
    res.status(404).json({ error: 'NotFound', message: 'Route not found' });
  });

  app.use(errorHandler);

  return app;
};
