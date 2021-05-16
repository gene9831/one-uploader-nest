import { Test, TestingModule } from '@nestjs/testing';
import { UploadTaskService } from './upload-task.service';

describe('UploadTaskService', () => {
  let service: UploadTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadTaskService],
    }).compile();

    service = module.get<UploadTaskService>(UploadTaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
