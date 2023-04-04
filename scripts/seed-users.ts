// src/seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DatabaseSeederService } from '../src/user/database/database-seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const databaseSeederService = app.get(DatabaseSeederService);

  const isClear = process.argv.includes('--clear');

  if (isClear) {
    await databaseSeederService.clearDatabase();
    await databaseSeederService.resetPrimaryKeySequence();
    console.log('Database cleared');
  } else {
    await databaseSeederService.seedUsers();
    console.log('Users seeded');
  }

  await app.close();
}

bootstrap();
