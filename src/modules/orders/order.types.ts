import { OrderStatus } from '../../shared/domain';

export interface CreateOrderItemInput {
  productId: number;
  quantity: number;
}

export interface CreateOrderInput {
  customerId: number;
  items: CreateOrderItemInput[];
  paymentSimulation?: 'APPROVE' | 'REJECT';
  paymentMethod?: string;
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
}
