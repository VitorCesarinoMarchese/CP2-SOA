import { OrderItem, Product } from '../../shared/domain';
import { NotFoundError } from '../../shared/errors/NotFoundError';
import { StockError } from '../../shared/errors/StockError';
import { ProductRepository } from '../products/product.repository';
import { StockRepository } from './stock.repository';

export class StockService {
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly productRepository: ProductRepository
  ) {}

  async getAvailableQuantity(productId: number): Promise<number> {
    const available = await this.stockRepository.getAvailableQuantity(productId);
    if (available === null) {
      throw new NotFoundError(`Product ${productId} not found`);
    }

    return available;
  }

  async checkAvailability(items: OrderItem[]): Promise<void> {
    for (const item of items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new NotFoundError(`Product ${item.productId} not found`);
      }
      if (product.quantityInStock < item.quantity) {
        throw new StockError(`Insufficient stock for product ${product.id}`, {
          productId: product.id,
          requested: item.quantity,
          available: product.quantityInStock,
        });
      }
    }
  }

  async decreaseStock(items: OrderItem[]): Promise<Product[]> {
    return this.stockRepository.decreaseStock(items);
  }
}
