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
  id: number; // Khóa chính

  @ManyToOne(() => User, (user) => user.id) // Mối quan hệ với bảng users
  @JoinColumn({ name: 'user_id' })
  user: User; // Người dùng liên quan đến ca làm việc

  @Column()
  name: string; // Tên ca làm việc

  @Column('text', { nullable: true })
  description: string; // Mô tả chi tiết, nullable để có thể không có giá trị

  @Column({ type: 'time' })
  start_morning_time: string; // Giờ bắt đầu buổi sáng

  @Column({ type: 'time' })
  end_morning_time: string; // Giờ kết thúc buổi sáng

  @Column({ type: 'time' })
  start_afternoon_time: string; // Giờ bắt đầu buổi chiều

  @Column({ type: 'time' })
  end_afternoon_time: string; // Giờ kết thúc buổi chiều

  @Column({ type: 'timestamp' })
  request_time: Date; // Thời gian yêu cầu

  @Column({ type: 'date' })
  apply_date: Date; // Ngày áp dụng

  @ManyToOne(() => User, (user) => user.id, { nullable: true }) // Người duyệt (nullable)
  @JoinColumn({ name: 'approved_by' })
  approved_by: User; // Người duyệt

  @Column({ type: 'timestamp', nullable: true })
  approved_at: Date; // Thời gian duyệt

  @Column()
  status: string; // Trạng thái (pending/approved/rejected)

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date; // Thời gian tạo

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date; // Thời gian cập nhật
}
