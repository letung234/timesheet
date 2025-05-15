import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Request } from './request.entity';

@Entity('absence_types')
export class AbsenceType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar' }) // paid / unpaid
  type: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ type: 'boolean', default: false })
  deduct_leave_day: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => Request, (request) => request.absenceType)
  requests: Request[];
}
