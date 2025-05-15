import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ProjectMember } from './project-member.entity';
import { Task } from '../../task/entities/task.entity';
import { ProjectStatus } from '../enums/project-status.enum';
import { Customer } from './customer.entity';
import { ProjectOtSetting } from './project-ot-setting.entity';
import { DailyAttendance } from '~/modules/timesheet/entities/daily_attendance.entity';

@Entity('projects')
export class Project {
  @PrimaryColumn()
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.PENDING,
  })
  status: ProjectStatus;

  @Column({ default: true })
  isActive: boolean;

  @Column({ name: 'customer_id', nullable: true })
  customer_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ name: 'created_by' })
  created_by: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;

  @Column({ name: 'updated_by', nullable: true })
  updated_by: number;

  @OneToMany(() => ProjectMember, (member) => member.project)
  members: ProjectMember[];

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @ManyToOne(() => Customer, (customer) => customer.projects)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @OneToMany(() => ProjectOtSetting, (setting) => setting.project)
  otSettings: ProjectOtSetting[];

  @OneToMany(() => DailyAttendance, (attendance) => attendance.project)
  attendances: DailyAttendance[];
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
