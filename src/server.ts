import { prisma } from './shared/database/prisma';
import { seedDatabase } from './shared/database/seed';
import { buildApp } from './app';

const port = Number(process.env.PORT ?? 3000);

async function bootstrap() {
  await seedDatabase(prisma);

  const app = buildApp(prisma);
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
