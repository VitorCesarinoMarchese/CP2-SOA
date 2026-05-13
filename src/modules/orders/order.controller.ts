import { Request, Response } from 'express';
import { OrderStatus } from '../../shared/domain';
import { OrderService } from './order.service';

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  createOrder = async (req: Request, res: Response) => {
    const result = await this.orderService.createOrder(req.body);
    return res.status(201).json({ data: result });
  };

  getOrderById = async (req: Request, res: Response) => {
    const orderId = Number(req.params.id);
    const result = await this.orderService.getOrderById(orderId);
    return res.json({ data: result });
  };

  listOrders = async (_req: Request, res: Response) => {
    const result = await this.orderService.listOrders();
    return res.json({ data: result });
  };

  updateOrderStatus = async (req: Request, res: Response) => {
    const orderId = Number(req.params.id);
    const status = req.body.status as OrderStatus;
    const result = await this.orderService.updateOrderStatus(orderId, { status });
    return res.json({ data: result });
  };
}
