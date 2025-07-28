import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from './project.entity';

@Entity('project_ot_setting')
@Unique(['projectCode', 'dateAt'])
export class ProjectOTSetting {
  @PrimaryGeneratedColumn({ name: 'ProjectOTID' })
  id: number;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'Projectcode' })
  project: Project;

  @Column({ type: 'varchar', name: 'Projectcode' })
  projectCode: string;

  @Column({ type: 'date', name: 'DateAt', nullable: false })
  dateAt: Date;

  @Column({ type: 'float', name: 'OTCoefficient', default: 1.0 })
  otCoefficient: number;

  @Column({ type: 'text', name: 'Note', nullable: true })
  note: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'CreatedBy' })
  createdBy: User;

  @CreateDateColumn({ type: 'timestamp', name: 'CreatedAt' })
  createdAt: Date;
}
