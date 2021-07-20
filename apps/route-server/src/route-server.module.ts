import { Module } from '@nestjs/common';
import { RouteServerController } from './route-server.controller';

@Module({
  imports: [],
  controllers: [RouteServerController],
  providers: [],
})
export class RouteServerModule {}
