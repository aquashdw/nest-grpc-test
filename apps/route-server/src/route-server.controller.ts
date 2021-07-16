import { Controller, Get } from '@nestjs/common';
import { RouteServerService } from './route-server.service';
import { GrpcMethod } from '@nestjs/microservices';
import { Feature, Point } from '@app/route-lib';

@Controller()
export class RouteServerController {
  constructor(private readonly routeServerService: RouteServerService) {}

  @GrpcMethod('RouteGuide', 'GetFeature')
  getFeature(data: Point): Feature {
    return { name: 'test', location: { latitude: 10, longitude: 10 } };
  }
}
