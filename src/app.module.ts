import { Module } from '@nestjs/common';
import appConfig from '~/config/app.config';
import databaseConfig from '~/config/database.config';
import jwtConfig from '~/config/jwt.config';
import cloudinaryConfig from '~/config/cloudinary.config';
import { validateEnv } from '~/config/validation';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Auth Module
import { AuthModule } from '~/modules/auth/auth.module';
import { AuthService } from '~/modules/auth/auth.service';
import { AuthController } from '~/modules/auth/auth.controller';
import { Role } from './modules/auth/entities/role.entity';
import { RolePermission } from './modules/auth/entities/role-permission.entity';
import { Permission } from './modules/auth/entities/permission.entity';
import { UserRole } from './modules/auth/entities/user-role.entity';

// User Module
import { UsersModule } from './modules/users/users.module';
import { User } from './modules/users/entities/user.entity';

// Refresh Token Module
import { RefreshTokenModule } from './modules/refresh-token/refresh-token.module';
import { RefreshToken } from './modules/refresh-token/entities/refresh-token.entity';

// Project Module
import { ProjectModule } from './modules/project/project.module';
import { Project } from './modules/project/entities/project.entity';
import { Customer } from './modules/project/entities/customer.entity';
import { ProjectMember } from './modules/project/entities/project-member.entity';
import { ProjectOtSetting } from './modules/project/entities/project-ot-setting.entity';

// Task Module
import { TaskModule } from './modules/task/task.module';
import { Task } from './modules/task/entities/task.entity';

// Timesheet Module
import { TimesheetModule } from './modules/timesheet/timesheet.module';
import { DailyAttendance } from './modules/timesheet/entities/daily_attendance.entity';
import { WorkingTime } from './modules/timesheet/entities/working-time.entity';

// Request Module
import { RequestModule } from './modules/request/request.module';
import { Request } from './modules/request/entities/request.entity';
import { AbsenceType } from './modules/request/entities/absence_type.entity';

// Branch Module
import { BranchModule } from './modules/branch/branch.module';
import { Branch } from './modules/branch/entities/branch.entity';

// Level Module
import { LevelModule } from './modules/level/level.module';
import { Level } from './modules/level/entities/level.entity';

// Position Module
import { PositionModule } from './modules/position/position.module';
import { Position } from './modules/position/entities/position.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`, `.env.${process.env.NODE_ENV}`],
      load: [appConfig, databaseConfig, jwtConfig, cloudinaryConfig],
      validationSchema: validateEnv(),
    }),
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
    AuthModule,
    UsersModule,
    RefreshTokenModule,
    ProjectModule,
    TaskModule,
    TimesheetModule,
    RequestModule,
    BranchModule,
    LevelModule,
    PositionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
