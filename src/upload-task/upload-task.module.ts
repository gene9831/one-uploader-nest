import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MsModule } from 'src/ms/ms.module';
import { UploadTask } from './entities/upload-task.entity';
import { UploadTaskService } from './upload-task.service';

@Module({
  imports: [TypeOrmModule.forFeature([UploadTask]), MsModule],
  providers: [UploadTaskService],
})
export class UploadTaskModule {}
