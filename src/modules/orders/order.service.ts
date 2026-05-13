import {
  Notification,
  NotificationType,
  Order,
  OrderItem,
  OrderStatus,
  Payment,
} from '../../shared/domain';
import { NotFoundError } from '../../shared/errors/NotFoundError';
import { PaymentRejectedError } from '../../shared/errors/PaymentRejectedError';
import { ValidationError } from '../../shared/errors/ValidationError';
import { CustomerService } from '../customers/customer.service';
import { NotificationService } from '../notifications/notification.service';
import { OrderRepository } from './order.repository';
import { PaymentService } from '../payments/payment.service';
import { ProductService } from '../products/product.service';
import { StockService } from '../stock/stock.service';
import { CreateOrderInput, UpdateOrderStatusInput } from './order.types';

export interface OrderDetails {
  order: Order;
  payment: Payment | null;
  notifications: Notification[];
}

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.CRIADO]: [OrderStatus.AGUARDANDO_PAGAMENTO, OrderStatus.CANCELADO],
  [OrderStatus.AGUARDANDO_PAGAMENTO]: [OrderStatus.PAGO, OrderStatus.CANCELADO],
  [OrderStatus.PAGO]: [OrderStatus.FINALIZADO, OrderStatus.CANCELADO],
  [OrderStatus.FINALIZADO]: [],
  [OrderStatus.CANCELADO]: [],
};

export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly customerService: CustomerService,
    private readonly productService: ProductService,
    private readonly stockService: StockService,
    private readonly paymentService: PaymentService,
    private readonly notificationService: NotificationService
  ) {}

  async createOrder(input: CreateOrderInput): Promise<OrderDetails> {
    if (!input.items || input.items.length === 0) {
      throw new ValidationError('Order must contain at least one item');
    }

    const customer = await this.customerService.getCustomer(input.customerId);
    const orderItems = await this.buildOrderItems(input.items);
    await this.stockService.checkAvailability(orderItems);

    const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

    const created = await this.orderRepository.create({
      customerId: customer.id,
      items: orderItems,
      total,
      status: OrderStatus.CRIADO,
    });

    await this.orderRepository.updateStatus(created.id, OrderStatus.AGUARDANDO_PAGAMENTO);

    try {
      const payment = await this.paymentService.processPayment({
        orderId: created.id,
        amount: total,
        method: input.paymentMethod,
        simulation: input.paymentSimulation,
      });

      await this.stockService.decreaseStock(orderItems);
      await this.orderRepository.updateStatus(created.id, OrderStatus.PAGO);
      const finishedOrder = await this.orderRepository.updateStatus(created.id, OrderStatus.FINALIZADO);

      await this.notificationService.record(
        finishedOrder.id,
        NotificationType.PAYMENT_APPROVED,
        `Payment approved for order ${finishedOrder.id}`
      );
      await this.notificationService.record(
        finishedOrder.id,
        NotificationType.ORDER_FINISHED,
        `Order ${finishedOrder.id} finished successfully`
      );

      return {
        order: finishedOrder,
        payment,
        notifications: await this.notificationService.listByOrderId(finishedOrder.id),
      };
    } catch (error) {
      if (error instanceof PaymentRejectedError) {
        const canceledOrder = await this.orderRepository.updateStatus(created.id, OrderStatus.CANCELADO);
        await this.notificationService.record(
          canceledOrder.id,
          NotificationType.ORDER_CANCELED,
          `Order ${canceledOrder.id} canceled because payment was rejected`
        );

        throw new PaymentRejectedError('Payment was rejected', {
          order: canceledOrder,
          payment: await this.paymentService.getPaymentByOrderId(canceledOrder.id),
          notifications: await this.notificationService.listByOrderId(canceledOrder.id),
        });
      }

      throw error;
    }
  }

  async getOrderById(id: number): Promise<OrderDetails> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError(`Order ${id} not found`);
    }

    return {
      order,
      payment: await this.paymentService.getPaymentByOrderId(id),
      notifications: await this.notificationService.listByOrderId(id),
    };
  }

  async listOrders(): Promise<OrderDetails[]> {
    const orders = await this.orderRepository.findAll();
    return Promise.all(
      orders.map(async (order) => ({
        order,
        payment: await this.paymentService.getPaymentByOrderId(order.id),
        notifications: await this.notificationService.listByOrderId(order.id),
      }))
    );
  }

  async updateOrderStatus(id: number, input: UpdateOrderStatusInput): Promise<OrderDetails> {
    const current = await this.orderRepository.findById(id);
    if (!current) {
      throw new NotFoundError(`Order ${id} not found`);
    }

    if (!ALLOWED_TRANSITIONS[current.status]?.includes(input.status)) {
      throw new ValidationError(`Status transition from ${current.status} to ${input.status} is not allowed`);
    }

    const updated = await this.orderRepository.updateStatus(id, input.status);

    if (input.status === OrderStatus.FINALIZADO) {
      await this.notificationService.record(
        updated.id,
        NotificationType.ORDER_FINISHED,
        `Order ${updated.id} finalized`
      );
    }

    if (input.status === OrderStatus.CANCELADO) {
      await this.notificationService.record(
        updated.id,
        NotificationType.ORDER_CANCELED,
        `Order ${updated.id} canceled`
      );
    }

    return {
      order: updated,
      payment: await this.paymentService.getPaymentByOrderId(id),
      notifications: await this.notificationService.listByOrderId(id),
    };
  }

  private async buildOrderItems(items: CreateOrderInput['items']): Promise<OrderItem[]> {
    return Promise.all(
      items.map(async (item) => {
        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
          throw new ValidationError(`Invalid quantity for product ${item.productId}`);
        }

        const product = await this.productService.getProduct(item.productId);
        const subtotal = Number((product.price * item.quantity).toFixed(2));

        return {
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
          unitPrice: product.price,
          subtotal,
        };
      })
    );
  }
}
