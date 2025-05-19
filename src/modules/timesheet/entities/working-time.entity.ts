import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '~/modules/users/entities/user.entity';

@Entity('working_time')
export class WorkingTime {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ type: 'time' })
  start_morning_time: string;

  @Column({ type: 'time' })
  end_morning_time: string;

  @Column({ type: 'time' })
  start_afternoon_time: string;

  @Column({ type: 'time' })
  end_afternoon_time: string;

  @Column({ type: 'timestamp' })
  request_time: Date;

  @Column({ type: 'date' })
  apply_date: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'approved_by' })
  approved_by: User;

  @Column({ type: 'timestamp', nullable: true })
  approved_at: Date;

  @Column()
  status: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
