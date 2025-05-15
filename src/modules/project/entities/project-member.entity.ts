import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from './project.entity';
import { ProjectRole } from '../enums/project-role.enum';

@Entity('project_members')
export class ProjectMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'project_id', type: 'varchar' })
  project_id: string;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({
    type: 'enum',
    enum: ProjectRole,
    default: ProjectRole.MEMBER,
  })
  role: ProjectRole;

  @Column({ name: 'added_by' })
  added_by: number;

  @ManyToOne(() => Project, (project) => project.members)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'added_by' })
  addedBy: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
