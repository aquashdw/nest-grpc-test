import { Module } from '@nestjs/common';
import { RouteClientController } from './route-client.controller';
import { RouteClientService } from './route-client.service';

@Module({
  imports: [],
  controllers: [RouteClientController],
  providers: [RouteClientService],
})
export class RouteClientModule {}
