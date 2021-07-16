import { Injectable } from '@nestjs/common';

@Injectable()
export class RouteClientService {
  getHello(): string {
    return 'Hello World!';
  }
}
