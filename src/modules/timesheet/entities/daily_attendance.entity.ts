import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '~/modules/users/entities/user.entity';
import { Task } from '../../task/entities/task.entity';
import { Project } from '../../project/entities/project.entity';

@Entity('daily_attendances')
export class DailyAttendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.attendances)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time', nullable: true })
  check_in: string;

  @Column({ type: 'time', nullable: true })
  check_out: string;

  @Column({ type: 'decimal', nullable: true })
  tracker_time: number;

  @ManyToOne(() => Task, (task) => task.attendances, { nullable: true })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @ManyToOne(() => Project, (project) => project.attendances, {
    nullable: true,
  })
  @JoinColumn({ name: 'project_code' })
  project: Project;

  @Column({ type: 'decimal', nullable: true })
  punishment_money: number;

  @Column({ type: 'text', nullable: true })
  complaint: string;

  @Column({ type: 'text', nullable: true })
  complaint_reply: string;

  @Column({ type: 'varchar', nullable: true })
  complaint_status: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'complaint_replied_by' })
  complaintRepliedBy: User;

  @Column({ type: 'timestamp', nullable: true })
  complaint_replied_at: Date;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'int', nullable: true })
  request_id: number;

  @Column({ type: 'text', nullable: true })
  note: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'approved_by' })
  approvedBy: User;

  @Column({ type: 'timestamp', nullable: true })
  approved_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
