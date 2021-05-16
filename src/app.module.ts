import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configs from './config/configuration';
import { MsModule } from './ms/ms.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { SerializedToken } from './ms/entities/token-cache.entity';
import { ConfigModule } from '@nestjs/config';
import { UploadTaskModule } from './upload-task/upload-task.module';
import { UploadTask } from './upload-task/entities/upload-task.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(process.cwd(), 'db.sqlite3'),
      entities: [SerializedToken, UploadTask],
      synchronize: true,
    }),
    MsModule,
    UploadTaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
