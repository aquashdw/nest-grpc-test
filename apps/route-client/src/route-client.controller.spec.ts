import { Test, TestingModule } from '@nestjs/testing';
import { RouteClientController } from './route-client.controller';
import { RouteClientService } from './route-client.service';

describe('RouteClientController', () => {
  let routeClientController: RouteClientController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RouteClientController],
      providers: [RouteClientService],
    }).compile();

    routeClientController = app.get<RouteClientController>(RouteClientController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(routeClientController.getHello()).toBe('Hello World!');
    });
  });
});
