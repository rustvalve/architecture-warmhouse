import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('telemetry')
@Index(['deviceId', 'createdAt'])
export class Telemetry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  deviceId: string;

  @Column('jsonb')
  data: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
