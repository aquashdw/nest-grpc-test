import { Injectable } from '@nestjs/common';

@Injectable()
export class RouteServerService {
  getHello(): string {
    return 'Hello World!';
  }
}
