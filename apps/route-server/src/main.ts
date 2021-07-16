import { NestFactory } from '@nestjs/core';
import { RouteServerModule } from './route-server.module';

async function bootstrap() {
  const app = await NestFactory.create(RouteServerModule);
  await app.listen(3000);
}
bootstrap();
