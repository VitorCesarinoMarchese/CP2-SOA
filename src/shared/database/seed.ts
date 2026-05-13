import { PrismaClient } from '@prisma/client';

export async function seedDatabase(prisma: PrismaClient) {
  const customerCount = await prisma.customer.count();
  if (customerCount === 0) {
    await prisma.customer.createMany({
      data: [
        { name: 'Ana Souza', email: 'ana@email.com' },
        { name: 'Bruno Lima', email: 'bruno@email.com' },
        { name: 'Carla Mendes', email: 'carla@email.com' },
      ],
    });
  }

  const productCount = await prisma.product.count();
  if (productCount === 0) {
    await prisma.product.createMany({
      data: [
        { name: 'Hambúrguer Artesanal', description: 'Pão, carne, queijo e molho especial', price: 32.9, quantityInStock: 10 },
        { name: 'Pizza Calabresa', description: 'Pizza média de calabresa', price: 49.9, quantityInStock: 5 },
        { name: 'Refrigerante 2L', description: 'Refrigerante cola 2 litros', price: 12, quantityInStock: 20 },
        { name: 'Batata Frita', description: 'Porção média de batata frita', price: 18.5, quantityInStock: 8 },
      ],
    });
  }
}
