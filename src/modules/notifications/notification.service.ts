import { Notification, NotificationType } from '../../shared/domain';
import { NotificationRepository } from './notification.repository';

export class NotificationService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async record(orderId: number, type: NotificationType, message: string): Promise<Notification> {
    const notification: Notification = {
      id: 0,
      orderId,
      type,
      message,
      createdAt: new Date().toISOString(),
    };

    const saved = await this.notificationRepository.save(notification);
    console.log(`[NOTIFICATION] ${type} - order=${orderId} - ${message}`);
    return saved;
  }

  async listNotifications(): Promise<Notification[]> {
    return this.notificationRepository.findAll();
  }

  async listByOrderId(orderId: number): Promise<Notification[]> {
    return this.notificationRepository.findByOrderId(orderId);
  }
}
