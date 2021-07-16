import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Point } from './message/point.message';
import { Feature } from './message/feature.message';
import { Observable } from 'rxjs';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';

interface RouteGuide {
  getFeature(data: Point): Observable<Feature>;
}

@Injectable()
export class RouteClientService implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: 'localhost:3001',
      package: 'routeguide',
      protoPath: join(__dirname, 'proto/route_guide.proto'),
    },
  })
  private readonly client: ClientGrpc;
  private routeGuide: RouteGuide;

  onModuleInit() {
    this.routeGuide = this.client.getService<RouteGuide>('RouteGuide');
  }

  async getHello(): Promise<string> {
    const result = await this.routeGuide
      .getFeature({ latitude: 10, longitude: 10 })
      .toPromise();
    console.log(JSON.stringify(result));
    return 'Hello World!';
  }
}
