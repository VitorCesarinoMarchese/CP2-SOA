export enum OrderStatus {
  CRIADO = 'CRIADO',
  AGUARDANDO_PAGAMENTO = 'AGUARDANDO_PAGAMENTO',
  PAGO = 'PAGO',
  FINALIZADO = 'FINALIZADO',
  CANCELADO = 'CANCELADO',
}

export enum PaymentStatus {
  PENDENTE = 'PENDENTE',
  APROVADO = 'APROVADO',
  RECUSADO = 'RECUSADO',
}

export enum NotificationType {
  PAYMENT_APPROVED = 'PAYMENT_APPROVED',
  ORDER_FINISHED = 'ORDER_FINISHED',
  ORDER_CANCELED = 'ORDER_CANCELED',
}

export type PaymentSimulation = 'APPROVE' | 'REJECT';

export interface Customer {
  id: number;
  name: string;
  email: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantityInStock: number;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  status: PaymentStatus;
  method: string;
  transactionId: string;
  processedAt: string;
}

export interface Notification {
  id: number;
  orderId: number;
  type: NotificationType;
  message: string;
  createdAt: string;
}
