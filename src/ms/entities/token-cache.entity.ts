import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SerializedToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  serializedToken: string;
}
