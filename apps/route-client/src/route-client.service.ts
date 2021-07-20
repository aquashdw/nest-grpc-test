import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Observable, ReplaySubject } from 'rxjs';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import {
  Feature,
  Point,
  RouteGuide,
  RouteNote,
  RouteSummary,
} from '@app/route-lib';

@Injectable()
export class RouteClientService implements OnModuleInit {
  private readonly logger = new Logger(RouteClientService.name);
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
    // blocking
    const resultGetFeature = this.getFeature(10, 10);
    await resultGetFeature.forEach((next: Feature) => {
      this.logger.log(`getFeature next.name: ${next.name}`);
      this.logger.log(
        `getFeature next.location: ${JSON.stringify(next.location)}`,
      );
    });

    // server-streaming
    const resultListFeatures = this.listFeatures(15, 5, 15, 5);
    await resultListFeatures.forEach((next: Feature) => {
      this.logger.log(`listFeature next.name: ${next.name}`);
      this.logger.log(
        `listFeature next.location: ${JSON.stringify(next.location)}`,
      );
    });

    // client-streaming
    const resultRecordRoute = this.recordRoute([
      {
        latitude: 1,
        longitude: 1,
      },
      {
        latitude: 2,
        longitude: 2,
      },
      {
        latitude: 3,
        longitude: 3,
      },
    ]);
    await resultRecordRoute.forEach((next: RouteSummary) => {
      this.logger.log(`recordRoute result: ${JSON.stringify(next)}`);
    });

    // bi-streaming
    const resultRouteChat = this.routeChat([
      {
        location: {
          latitude: 1,
          longitude: 1,
        },
        message: 'one',
      },
      {
        location: {
          latitude: 2,
          longitude: 2,
        },
        message: 'two',
      },
      {
        location: {
          latitude: 3,
          longitude: 3,
        },
        message: 'three',
      },
    ]);
    await resultRouteChat.forEach((next: RouteNote) => {
      this.logger.log(`routeChat message: ${JSON.stringify(next)}`);
    });

    return 'Hello World!';
  }

  getFeature(latitude: number, longitude: number): Observable<Feature> {
    return this.routeGuide.getFeature({
      latitude: latitude,
      longitude: longitude,
    });
  }

  listFeatures(
    latitudeHi: number,
    latitudeLo: number,
    longitudeHi: number,
    longitudeLo: number,
  ): Observable<Feature> {
    return this.routeGuide.listFeatures({
      hi: {
        latitude: latitudeHi,
        longitude: longitudeHi,
      },
      lo: {
        latitude: latitudeLo,
        longitude: longitudeLo,
      },
    });
  }

  recordRoute(points: Point[]): Observable<RouteSummary> {
    const subject = new ReplaySubject<Point>();
    const resultStream = this.routeGuide.recordRoute(subject.asObservable());
    for (const point of points) {
      subject.next(point);
    }
    subject.complete();

    return resultStream;
  }

  routeChat(notes: RouteNote[]): Observable<RouteNote> {
    const subject = new ReplaySubject<RouteNote>();
    for (const note of notes) {
      subject.next(note);
    }
    subject.complete();

    return this.routeGuide.routeChat(subject);
  }
}
