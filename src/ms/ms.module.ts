import { HttpModule, Module } from '@nestjs/common';
import { MsService } from './ms.service';
import { MsController } from './ms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SerializedToken } from './entities/token-cache.entity';
import { DriveApiService } from './drive-api.service';

@Module({
  imports: [TypeOrmModule.forFeature([SerializedToken]), HttpModule],
  providers: [MsService, DriveApiService],
  controllers: [MsController],
  exports: [MsService, DriveApiService],
})
export class MsModule {}
