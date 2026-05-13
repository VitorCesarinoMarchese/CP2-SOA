import { Product } from '../../shared/domain';
import { NotFoundError } from '../../shared/errors/NotFoundError';
import { ProductRepository } from './product.repository';

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async listProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async getProduct(id: number): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundError(`Product ${id} not found`);
    }
    return product;
  }
}
