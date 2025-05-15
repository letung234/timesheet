import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Branch } from './branch.entity';
import { Level } from './level.entity';
import { Position } from './position.entity';
import { Role } from '~/modules/auth/entities/role.entity';
import { UserRole } from '~/modules/auth/entities/user-role.entity';
import { DailyAttendance } from '~/modules/timesheet/entities/daily_attendance.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ nullable: true })
  avatar_public_id: string;

  @Column()
  fullname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  branch_id: number;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column({ nullable: true })
  position_id: number;
  @Column({ nullable: true })
  sex: string;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'decimal', nullable: true })
  salary: number;

  @Column({ type: 'date', nullable: true })
  salaryAt: Date;

  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @ManyToOne(() => Level)
  @JoinColumn({ name: 'level_id' })
  level: Level;

  @ManyToOne(() => Position)
  @JoinColumn({ name: 'position_id' })
  position: Position;

  @Column({ nullable: true })
  skill: string;

  @Column({ nullable: true })
  remainLeaveDay: number;

  @Column({ nullable: true })
  bank: string;

  @Column({ nullable: true })
  bankAccount: string;

  @Column({ nullable: true })
  taxCode: string;

  @Column({ nullable: true })
  emergencyContact: string;

  @Column({ nullable: true })
  emergencyContactPhone: string;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

  @Column({ nullable: true })
  insuranceStatus: string;

  @Column({ nullable: true })
  identify: string;

  @Column({ nullable: true })
  placeOfOrigin: string;

  @Column({ nullable: true })
  placeOfResidence: string;

  @Column({ nullable: true })
  currentAddress: string;

  @Column({ type: 'date', nullable: true })
  dateOfIssue: Date;

  @Column({ nullable: true })
  issuedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'trainer_id' })
  trainer: User;

  @Column({ nullable: true })
  level_id: number;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @OneToMany(() => DailyAttendance, (attendance) => attendance.user)
  attendances: DailyAttendance[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
