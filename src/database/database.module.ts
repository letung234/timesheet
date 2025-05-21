import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Entities
import { User } from '../modules/users/entities/user.entity';
import { Role } from '../modules/auth/entities/role.entity';
import { UserRole } from '../modules/auth/entities/user-role.entity';
import { RolePermission } from '../modules/auth/entities/role-permission.entity';
import { Permission } from '../modules/auth/entities/permission.entity';
import { Project } from '../modules/project/entities/project.entity';
import { Task } from '../modules/task/entities/task.entity';
import { DailyAttendance } from '../modules/timesheet/entities/daily_attendance.entity';
import { Request } from '../modules/request/entities/request.entity';
import { Customer } from '../modules/project/entities/customer.entity';
import { ProjectMember } from '../modules/project/entities/project-member.entity';
import { WorkingTime } from '../modules/timesheet/entities/working-time.entity';
import { AbsenceType } from '../modules/request/entities/absence_type.entity';
import { Branch } from '../modules/branch/entities/branch.entity';
import { Level } from '../modules/level/entities/level.entity';
import { Position } from '../modules/position/entities/position.entity';
import { RefreshToken } from '../modules/refresh-token/entities/refresh-token.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.db'),
        ssl: configService.get<boolean>('database.ssl')
          ? { rejectUnauthorized: false }
          : false,
        synchronize: false,
        entities: [
          User,
          Role,
          UserRole,
          RolePermission,
          Permission,
          Project,
          Task,
          DailyAttendance,
          Request,
          Customer,
          ProjectMember,
          WorkingTime,
          AbsenceType,
          Branch,
          Level,
          Position,
          RefreshToken,
        ],
        migrations: ['dist/database/migrations/*.js'],
        migrationsTableName: 'migration',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
