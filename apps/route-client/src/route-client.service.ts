import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Feature, Point, RouteGuide } from '@app/route-lib';
import { RouteSummary } from '@app/route-lib/message/route-summary';
import { RouteNote } from '@app/route-lib/message/route-note';

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
    const resultGetFeature = await this.getFeature(10, 10);
    resultGetFeature.forEach((next: Feature) => {
      this.logger.log(`getFeature next.name: ${next.name}`);
      this.logger.log(
        `getFeature next.location: ${JSON.stringify(next.location)}`,
      );
    });

    // server-streaming
    const resultListFeatures = await this.listFeatures(15, 5, 15, 5);
    resultListFeatures.forEach((next: Feature) => {
      this.logger.log(`listFeature next.name: ${next.name}`);
      this.logger.log(
        `listFeature next.location: ${JSON.stringify(next.location)}`,
      );
    });

    // client-streaming
    const resultRecordRoute = await this.recordRoute([
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
    this.logger.log(`recordRoute result: ${JSON.stringify(resultRecordRoute)}`);

    // bi-streaming
    const resultRouteChat = await this.routeChat([
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
    this.logger.log(`routeChat result: ${JSON.stringify(resultRouteChat)}`);

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

  async recordRoute(points: Point[]): Promise<RouteSummary> {
    const subject = new ReplaySubject<Point>();
    const resultStream = await this.routeGuide.recordRoute(
      subject.asObservable(),
    );
    for (const point of points) {
      subject.next(point);
    }
    subject.complete();

    return resultStream.toPromise();
  }

  // under construction
  async routeChat(notes: RouteNote[]): Promise<RouteNote[]> {
    const subject = new ReplaySubject<RouteNote>();
    for (const note of notes) {
      subject.next(note);
    }
    subject.complete();

    const resultStream = await this.routeGuide.routeChat(subject);
    const resultNotes: RouteNote[] = [];
    resultStream.forEach((next: RouteNote) => {
      resultNotes.push(next);
    });

    return resultNotes;
  }
}
