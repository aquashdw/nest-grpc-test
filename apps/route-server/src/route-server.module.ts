import { Module } from '@nestjs/common';
import { RouteServerController } from './route-server.controller';
import { RouteServerService } from './route-server.service';

@Module({
  imports: [],
  controllers: [RouteServerController],
  providers: [RouteServerService],
})
export class RouteServerModule {}
