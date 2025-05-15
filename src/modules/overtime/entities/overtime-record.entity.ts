import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { DailyAttendance } from '../../timesheet/entities/daily_attendance.entity';
import { Project } from '../../project/entities/project.entity';

@Entity('overtime_records')
export class OvertimeRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'project_code' })
  project_code: string;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_code' })
  project: Project;

  @Column({ name: 'user_id' })
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'time' })
  end_time: string;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  total_hours: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  rejection_reason: string | null;

  @Column({ name: 'approver_id', nullable: true })
  approver_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'approver_id' })
  approver: User;



  @Column({ name: 'created_by' })
  created_by: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ name: 'updated_by', nullable: true })
  updated_by: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
