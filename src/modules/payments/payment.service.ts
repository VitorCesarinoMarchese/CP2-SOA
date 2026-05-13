import { randomUUID } from 'crypto';
import { Payment, PaymentSimulation, PaymentStatus } from '../../shared/domain';
import { PaymentRejectedError } from '../../shared/errors/PaymentRejectedError';
import { PaymentRepository } from './payment.repository';

export interface ProcessPaymentInput {
  orderId: number;
  amount: number;
  method?: string;
  simulation?: PaymentSimulation;
}

export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async processPayment(input: ProcessPaymentInput): Promise<Payment> {
    const shouldApprove = input.simulation !== 'REJECT';
    const payment: Payment = {
      id: 0,
      orderId: input.orderId,
      amount: input.amount,
      status: shouldApprove ? PaymentStatus.APROVADO : PaymentStatus.RECUSADO,
      method: input.method ?? 'SIMULATED_CARD',
      transactionId: randomUUID(),
      processedAt: new Date().toISOString(),
    };

    const saved = await this.paymentRepository.save(payment);

    if (!shouldApprove) {
      throw new PaymentRejectedError('Payment was rejected', {
        orderId: input.orderId,
        paymentId: saved.id,
      });
    }

    return saved;
  }

  async getPaymentByOrderId(orderId: number): Promise<Payment | null> {
    return this.paymentRepository.findByOrderId(orderId);
  }

  async listPayments(): Promise<Payment[]> {
    return this.paymentRepository.findAll();
  }
}
