import { Test, TestingModule } from '@nestjs/testing';
import { RouteServerController } from './route-server.controller';
import { RouteServerService } from './route-server.service';

describe('RouteServerController', () => {
  let routeServerController: RouteServerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RouteServerController],
      providers: [RouteServerService],
    }).compile();

    routeServerController = app.get<RouteServerController>(RouteServerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(routeServerController.getHello()).toBe('Hello World!');
    });
  });
});
