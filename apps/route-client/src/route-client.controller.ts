import { Controller, Get } from '@nestjs/common';
import { RouteClientService } from './route-client.service';

@Controller()
export class RouteClientController {
  constructor(private readonly routeClientService: RouteClientService) {}

  @Get()
  getHello(): string {
    return this.routeClientService.getHello();
  }
}
