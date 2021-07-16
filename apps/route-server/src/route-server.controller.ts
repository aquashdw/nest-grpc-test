import { Controller, Get } from '@nestjs/common';
import { RouteServerService } from './route-server.service';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Point } from './message/point.message';
import { Feature } from './message/feature.message';

@Controller()
export class RouteServerController {
  constructor(private readonly routeServerService: RouteServerService) {}

  @GrpcMethod('RouteGuide', 'GetFeature')
  getFeature(data: Point): Feature {
    console.log(JSON.stringify(data));
    return { name: 'test', location: { latitude: 10, longitude: 10 } };
  }
}
