import { NestFactory } from '@nestjs/core';
import { RouteClientModule } from './route-client.module';

async function bootstrap() {
  const app = await NestFactory.create(RouteClientModule);
  await app.listen(3000);
}
bootstrap();
