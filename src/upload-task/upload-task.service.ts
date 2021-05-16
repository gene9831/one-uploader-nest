import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MsService } from 'src/ms/ms.service';
import { Repository } from 'typeorm';
import { UploadTask, UploadTaskStatus } from './entities/upload-task.entity';
import fs from 'fs';
import { DriveApiService } from 'src/ms/drive-api.service';

@Injectable()
export class UploadTaskService {
  exitFlag = false;
  private readonly taskCidSet = new Set<string>();

  constructor(
    @InjectRepository(UploadTask)
    private readonly uploadTaskRepo: Repository<UploadTask>,
    private readonly msService: MsService,
    private readonly driveApiService: DriveApiService,
  ) {
    const uploadTaskEntity = new UploadTask();
    uploadTaskEntity.cid = '1';
    // uploadTaskEntity.filename = 'filename';
    // uploadTaskEntity.size = 10000000000000;
    // uploadTaskEntity.localFilePath = 'local file path';
    // uploadTaskEntity.onedriveUsername = 'username111';
    // uploadTaskEntity.onedriveDirPath = 'onedriveDirPath';
    // uploadTaskEntity.status = UploadTaskStatus.PENDING;

    // uploadTaskRepo.save(uploadTaskEntity).then((result) => {
    //   console.debug(result);
    // });

    this.start_loop().then((result) => {
      console.debug(result);
    });

    setTimeout(() => {
      this.exitFlag = true;
    }, 3000);
  }

  start_loop() {
    return new Promise(async (resolve: (value: string) => void) => {
      while (!this.exitFlag) {
        if (this.taskCidSet.size < 5) {
          // 查找status为pending的任务
          const uploadTask = await this.uploadTaskRepo.findOne({
            where: { status: UploadTaskStatus.PENDING },
          });
          if (uploadTask && !this.taskCidSet.has(uploadTask.cid)) {
            // 将cid放到Set中，并新增任务
            this.taskCidSet.add(uploadTask.cid);
            this.upload(uploadTask).then(() => {
              console.log(this.taskCidSet);
              this.taskCidSet.delete(uploadTask.cid);
              console.log(this.taskCidSet);
            });
          }
        }

        // 延迟1000ms
        await this.delay(1000);

        //! test break
        break;
      }
      resolve('done');
    });
  }

  /**
   * 上传文件
   * @param task
   * @returns
   */
  private async upload(task: UploadTask) {
    if (task.uploaded === task.size) {
      console.warn(`file ${task.localFilePath} already uploaded before`);
      task.status = UploadTaskStatus.FINISHED;
      this.uploadTaskRepo.save(task);
      return;
    }

    const token = await this.msService.acquireTokenSilent(
      task.onedriveUsername,
    );
    if (!token) {
      const e = `can not acquire token from user ${task.onedriveUsername}`;
      console.error(e);
      task.status = UploadTaskStatus.STOPPED;
      task.error = e;
      this.uploadTaskRepo.save(task);
      return;
    }

    task.status = UploadTaskStatus.UPLOADING;
    this.uploadTaskRepo.save(task);

    if (task.size <= 4 * 1024 * 1024) {
      return await this.uploadSmallFile(token.accessToken, task);
    }
    return await this.uploadLargeFile(token.accessToken, task);
  }

  /**
   * 上传小文件
   * @param accessToken
   * @param task
   */
  private async uploadSmallFile(accessToken: string, task: UploadTask) {
    const now = new Date().getTime();

    const data = fs.readFileSync(task.localFilePath);
    try {
      const resp = await this.driveApiService.putContent(
        accessToken,
        task.onedriveDirPath,
        data,
      );
      console.debug(resp.data);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * 上传大文件
   * @param accessToken
   * @param task
   */
  private async uploadLargeFile(accessToken: string, task: UploadTask) {}

  private delay(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
