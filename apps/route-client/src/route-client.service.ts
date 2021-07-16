import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Feature, Point, RouteGuide } from '@app/route-lib';

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
    return 'Hello World!';
  }
}
