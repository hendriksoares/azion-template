import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '../app.service';

describe('# AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('## Defined', () => {
    it('should be defined "run" method', () => {
      expect(service.run()).toBeDefined();
    });
  });
});
