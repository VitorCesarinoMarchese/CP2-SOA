import { Request, Response } from 'express';
import { PaymentService } from './payment.service';

export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  listPayments = async (_req: Request, res: Response) => {
    return res.json({ data: await this.paymentService.listPayments() });
  };

  getPaymentByOrderId = async (req: Request, res: Response) => {
    const orderId = Number(req.params.orderId);
    const payment = await this.paymentService.getPaymentByOrderId(orderId);
    return res.json({ data: payment });
  };
}
