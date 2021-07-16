import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { RouteServerModule } from './route-server.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    RouteServerModule,
    {
      transport: Transport.GRPC,
      options: {
        url: 'localhost:3001',
        package: 'routeguide',
        protoPath: join(__dirname, 'proto/route_guide.proto'),
      },
    },
  );

  await app.listen();
}
bootstrap();
