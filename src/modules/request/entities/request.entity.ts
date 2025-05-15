import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../project/entities/project.entity';
import { RequestType } from '../enums/request-type.enum';
import { RequestStatus } from '../enums/request-status.enum';
import { AbsenceType } from '../enums/absence-type.enum';
import { AbsenceType as AbsenceTypeEntity } from './absence_type.entity';
import { DailyAttendance } from '../../timesheet/entities/daily_attendance.entity';

@Entity('requests')
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({
    type: 'enum',
    enum: RequestType,
  })
  type: RequestType;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.PENDING,
  })
  status: RequestStatus;

  @Column({
    type: 'enum',
    enum: AbsenceType,
    nullable: true,
  })
  absence_type: AbsenceType;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column({ type: 'time', nullable: true })
  start_time: string;

  @Column({ type: 'time', nullable: true })
  end_time: string;

  @Column({ type: 'text', nullable: true })
  rejection_reason: string | null;

  @Column({ nullable: true })
  project_id: string;

  @Column({ name: 'daily_attendance_id' })
  daily_attendance_id: number;

  @ManyToOne(() => DailyAttendance)
  @JoinColumn({ name: 'daily_attendance_id' })
  dailyAttendance: DailyAttendance;

  @Column({ name: 'requester_id' })
  requester_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'requester_id' })
  requester: User;

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

  @ManyToOne(() => AbsenceTypeEntity, (absenceType) => absenceType.requests)
  @JoinColumn({ name: 'absence_type_id' })
  absenceType: AbsenceTypeEntity;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;

}
