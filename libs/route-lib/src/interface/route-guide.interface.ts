import { Feature, Point, Rectangle } from '@app/route-lib';
import { Observable } from 'rxjs';
import { RouteSummary } from '@app/route-lib/message/route-summary';
import { RouteNote } from '@app/route-lib/message/route-note';

export interface RouteGuide {
  getFeature(data: Point): Observable<Feature>;
  listFeatures(data: Rectangle): Observable<Feature>;
  recordRoute(upstream: Observable<Point>): Observable<RouteSummary>;
  routeChat(upstream: Observable<RouteNote>): Observable<RouteNote>;
}
