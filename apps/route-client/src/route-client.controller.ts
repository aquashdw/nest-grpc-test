import { Controller, Get } from '@nestjs/common';
import { RouteClientService } from './route-client.service';

@Controller()
export class RouteClientController {
  constructor(private readonly routeClientService: RouteClientService) {}

  @Get()
  async getHello(): Promise<string> {
    return await this.routeClientService.getHello();
  }
}
