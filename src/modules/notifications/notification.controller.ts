import { Request, Response } from 'express';
import { NotificationService } from './notification.service';

export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  listNotifications = async (_req: Request, res: Response) => {
    return res.json({ data: await this.notificationService.listNotifications() });
  };

  listByOrderId = async (req: Request, res: Response) => {
    const orderId = Number(req.params.orderId);
    return res.json({ data: await this.notificationService.listByOrderId(orderId) });
  };
}
