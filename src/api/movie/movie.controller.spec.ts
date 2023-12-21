import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './movie.controller';
import { MovieService } from './movie.service';

describe('ApiController', () => {
  let apiController: ApiController;

  beforeEach(async () => {
    const Api: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [MovieService],
    }).compile();

    apiController = Api.get<ApiController>(ApiController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(apiController.getHello()).toBe('Hello World!');
    });
  });
});
