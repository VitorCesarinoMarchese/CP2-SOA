import { PrismaClient } from '@prisma/client';
import { Notification } from '../../shared/domain';

export class NotificationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private mapNotification(notification: {
    id: number;
    orderId: number;
    type: string;
    message: string;
    createdAt: Date;
  }): Notification {
    return {
      id: notification.id,
      orderId: notification.orderId,
      type: notification.type as Notification['type'],
      message: notification.message,
      createdAt: notification.createdAt.toISOString(),
    };
  }

  async save(notification: Notification): Promise<Notification> {
    const saved = await this.prisma.notification.create({
      data: {
        orderId: notification.orderId,
        type: notification.type,
        message: notification.message,
        createdAt: new Date(notification.createdAt),
      },
    });

    return this.mapNotification(saved);
  }

  async findAll(): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({ orderBy: { id: 'asc' } });
    return notifications.map((notification) => this.mapNotification(notification));
  }

  async findByOrderId(orderId: number): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { orderId },
      orderBy: { id: 'asc' },
    });

    return notifications.map((notification) => this.mapNotification(notification));
  }
}
