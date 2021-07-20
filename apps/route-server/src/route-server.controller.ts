import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import {
  Feature,
  Point,
  Rectangle,
  RouteNote,
  RouteSummary,
} from '@app/route-lib';
import { Observable, ReplaySubject, Subject } from 'rxjs';

@Controller()
export class RouteServerController {
  private readonly logger = new Logger(RouteServerController.name);

  @GrpcMethod('RouteGuide', 'GetFeature')
  getFeature(data: Point): Feature {
    this.logger.log(`getFeature request: ${JSON.stringify(data)}`);
    return { name: 'test', location: { latitude: 10, longitude: 10 } };
  }

  @GrpcMethod('RouteGuide', 'ListFeatures')
  listFeatures(data: Rectangle): Observable<Feature> {
    this.logger.log(`listFeatures request: ${JSON.stringify(data)}`);
    const subject = new ReplaySubject<Feature>();

    for (let i = 0; i < 10; i++)
      subject.next({
        name: `test-${i}`,
        location: {
          latitude: i * 10,
          longitude: i * 10,
        },
      });
    subject.complete();

    return subject;
  }

  @GrpcStreamMethod('RouteGuide', 'RecordRoute')
  recordRoute(upstream: Observable<Point>): Observable<RouteSummary> {
    const points: Point[] = [];
    const subject = new Subject<RouteSummary>();

    const onNext = (message: Point) => {
      this.logger.log(`recordRoute message: ${JSON.stringify(message)}`);
      points.push(message);
    };
    const onComplete = () => {
      subject.next({
        pointCount: points.length,
        featureCount: points.length / 2,
        distance: -1,
        elapsedTime: -1,
      });

      subject.complete();
    };
    upstream.subscribe({
      next: onNext,
      complete: onComplete,
    });

    return subject.asObservable();
  }

  @GrpcStreamMethod('RouteGuide', 'RouteChat')
  routeChat(upstream: Observable<RouteNote>): Observable<RouteNote> {
    const subject = new Subject<RouteNote>();

    const onNext = (message: RouteNote) => {
      this.logger.log(`routeChat message: ${JSON.stringify(message)}`);
      subject.next({
        location: {
          latitude: message.location.longitude,
          longitude: message.location.latitude,
        },
        message: message.message,
      });
    };
    const onComplete = () => subject.complete();
    upstream.subscribe({
      next: onNext,
      complete: onComplete,
    });
    return subject.asObservable();
  }
}
