import { PrismaClient } from '@prisma/client';
import { Order, OrderItem, OrderStatus } from '../../shared/domain';
import { NotFoundError } from '../../shared/errors/NotFoundError';

export interface CreateOrderRecordInput {
  customerId: number;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
}

export class OrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private mapOrder(order: {
    id: number;
    customerId: number;
    total: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    customer: { name: string; email: string };
    items: Array<{
      productId: number;
      quantity: number;
      unitPrice: number;
      subtotal: number;
      product: { name: string };
    }>;
  }): Order {
    return {
      id: order.id,
      customerId: order.customerId,
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      items: order.items.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      })),
      total: order.total,
      status: order.status as OrderStatus,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }

  async create(input: CreateOrderRecordInput): Promise<Order> {
    const created = await this.prisma.order.create({
      data: {
        customerId: input.customerId,
        total: input.total,
        status: input.status,
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
          })),
        },
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return this.mapOrder(created);
  }

  async findById(id: number): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return order ? this.mapOrder(order) : null;
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      orderBy: { id: 'asc' },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return orders.map((order) => this.mapOrder(order));
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    const updated = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return this.mapOrder(updated);
  }
}
