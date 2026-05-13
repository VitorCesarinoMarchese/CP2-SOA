import { Request, Response } from 'express';
import { CustomerService } from './customer.service';

export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  listCustomers = async (_req: Request, res: Response) => {
    const customers = await this.customerService.listCustomers();
    return res.json({ data: customers });
  };

  getCustomerById = async (req: Request, res: Response) => {
    const customerId = Number(req.params.id);
    const customer = await this.customerService.getCustomer(customerId);
    return res.json({ data: customer });
  };
}
