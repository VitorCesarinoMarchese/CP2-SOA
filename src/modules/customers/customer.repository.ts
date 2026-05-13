import { PrismaClient } from '@prisma/client';
import { Customer } from '../../shared/domain';

export class CustomerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private mapCustomer(customer: { id: number; name: string; email: string }): Customer {
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
    };
  }

  async findAll(): Promise<Customer[]> {
    const customers = await this.prisma.customer.findMany({ orderBy: { id: 'asc' } });
    return customers.map((customer) => this.mapCustomer(customer));
  }

  async findById(id: number): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    return customer ? this.mapCustomer(customer) : null;
  }
}
