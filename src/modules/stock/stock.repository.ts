import { PrismaClient } from '@prisma/client';
import { OrderItem, Product } from '../../shared/domain';

export class StockRepository {
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

  async getAvailableQuantity(productId: number): Promise<number | null> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { quantityInStock: true },
    });

    return product ? product.quantityInStock : null;
  }

  async decreaseStock(items: OrderItem[]): Promise<Product[]> {
    const updatedProducts: Product[] = [];

    for (const item of items) {
      const updated = await this.prisma.product.update({
        where: { id: item.productId },
        data: {
          quantityInStock: {
            decrement: item.quantity,
          },
        },
      });
      updatedProducts.push(this.mapProduct(updated));
    }

    return updatedProducts;
  }
}
