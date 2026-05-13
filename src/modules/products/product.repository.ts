import { PrismaClient } from '@prisma/client';
import { Product } from '../../shared/domain';

export class ProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private mapProduct(product: { id: number; name: string; description: string | null; price: number; quantityInStock: number }): Product {
    return {
      id: product.id,
      name: product.name,
      description: product.description ?? '',
      price: product.price,
      quantityInStock: product.quantityInStock,
    };
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({ orderBy: { id: 'asc' } });
    return products.map((product) => this.mapProduct(product));
  }

  async findById(id: number): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    return product ? this.mapProduct(product) : null;
  }

  async save(product: Product): Promise<Product> {
    const saved = await this.prisma.product.update({
      where: { id: product.id },
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        quantityInStock: product.quantityInStock,
      },
    });

    return this.mapProduct(saved);
  }
}
