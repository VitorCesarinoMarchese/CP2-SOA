import { PrismaClient } from '@prisma/client';
import { Payment } from '../../shared/domain';

export class PaymentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private mapPayment(payment: {
    id: number;
    orderId: number;
    amount: number;
    status: string;
    method: string | null;
    transactionId: string;
    processedAt: Date;
  }): Payment {
    return {
      id: payment.id,
      orderId: payment.orderId,
      amount: payment.amount,
      status: payment.status as Payment['status'],
      method: payment.method ?? 'SIMULATED_CARD',
      transactionId: payment.transactionId,
      processedAt: payment.processedAt.toISOString(),
    };
  }

  async save(payment: Payment): Promise<Payment> {
    const saved = await this.prisma.payment.create({
      data: {
        orderId: payment.orderId,
        amount: payment.amount,
        status: payment.status,
        method: payment.method,
        transactionId: payment.transactionId,
        processedAt: new Date(payment.processedAt),
      },
    });

    return this.mapPayment(saved);
  }

  async findByOrderId(orderId: number): Promise<Payment | null> {
    const payment = await this.prisma.payment.findUnique({ where: { orderId } });
    return payment ? this.mapPayment(payment) : null;
  }

  async findAll(): Promise<Payment[]> {
    const payments = await this.prisma.payment.findMany({ orderBy: { id: 'asc' } });
    return payments.map((payment) => this.mapPayment(payment));
  }
}
