import {
  Feature,
  Point,
  Rectangle,
  RouteSummary,
  RouteNote,
} from '@app/route-lib';
import { Observable } from 'rxjs';

export interface RouteGuide {
  getFeature(data: Point): Observable<Feature>;
  listFeatures(data: Rectangle): Observable<Feature>;
  recordRoute(upstream: Observable<Point>): Observable<RouteSummary>;
  routeChat(upstream: Observable<RouteNote>): Observable<RouteNote>;
}
