import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { User } from '../../users/entities/user.entity';

@Entity('project_ot_settings')
export class ProjectOtSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'project_id', type: 'varchar' })
  project_id: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1.5 })
  ot_rate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 2.0 })
  holiday_ot_rate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 3.0 })
  night_ot_rate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 4.0 })
  holiday_night_ot_rate: number;

  @Column({ name: 'created_by' })
  created_by: number;

  @Column({ name: 'updated_by', nullable: true })
  updated_by: number;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
