import { Module } from '@nestjs/common';
import appConfig from '~/config/app.config';
import databaseConfig from '~/config/database.config';
import jwtConfig from '~/config/jwt.config';
import cloudinaryConfig from '~/config/cloudinary.config';
import { validateEnv } from '~/config/validation';
import { ConfigModule } from '@nestjs/config';

// Database Module
import { DatabaseModule } from './database/database.module';

// Auth Module
import { AuthModule } from '~/modules/auth/auth.module';

// User Module
import { UsersModule } from './modules/users/users.module';

// Refresh Token Module
import { RefreshTokenModule } from './modules/refresh-token/refresh-token.module';

// Project Module
import { ProjectModule } from './modules/project/project.module';

// Task Module
import { TaskModule } from './modules/task/task.module';

// Timesheet Module
import { TimesheetModule } from './modules/timesheet/timesheet.module';

// Request Module
import { RequestModule } from './modules/request/request.module';

// Branch Module
import { BranchModule } from './modules/branch/branch.module';

// Level Module
import { LevelModule } from './modules/level/level.module';

// Position Module
import { PositionModule } from './modules/position/position.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`, `.env.${process.env.NODE_ENV}`],
      load: [appConfig, databaseConfig, jwtConfig, cloudinaryConfig],
      validationSchema: validateEnv(),
    }),
    DatabaseModule,
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
