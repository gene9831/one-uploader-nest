import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

export enum UploadTaskStatus {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  FINISHED = 'finished',
  STOPPING = 'stopping',
  STOPPED = 'stopped',
}

@Entity()
export class UploadTask {
  @PrimaryColumn()
  cid: string;

  @Column()
  filename: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column()
  localFilePath: string;

  @Column()
  onedriveUsername: string;

  @Column()
  onedriveDirPath: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  @Column({ default: UploadTaskStatus.PENDING })
  status: UploadTaskStatus;

  @Column({ type: 'text', nullable: true })
  uploadUrl?: string;

  @Column({ type: 'bigint', default: 0 })
  uploaded: number;

  @Column({ type: 'int', default: 0 })
  speed: number;

  @Column({ type: 'int', default: 0 })
  timeSpent: number;

  @Column({ type: 'text', nullable: true })
  error?: string;
}
