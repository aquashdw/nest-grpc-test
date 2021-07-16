import { Controller, Get } from '@nestjs/common';
import { RouteServerService } from './route-server.service';

@Controller()
export class RouteServerController {
  constructor(private readonly routeServerService: RouteServerService) {}

  @Get()
  getHello(): string {
    return this.routeServerService.getHello();
  }
}
