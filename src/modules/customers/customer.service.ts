import { Customer } from '../../shared/domain';
import { NotFoundError } from '../../shared/errors/NotFoundError';
import { CustomerRepository } from './customer.repository';

export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async listCustomers(): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }

  async getCustomer(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundError(`Customer ${id} not found`);
    }
    return customer;
  }
}
