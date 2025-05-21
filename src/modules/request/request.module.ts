import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestService } from './services/request.service';
import { RequestController } from './controllers/request.controller';
import { Request } from './entities/request.entity';
import { AbsenceType } from './entities/absence_type.entity';
import { Project } from '../project/entities/project.entity';
import { User } from '../users/entities/user.entity';
import { DailyAttendance } from '../timesheet/entities/daily_attendance.entity';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Request,
      AbsenceType,
      Project,
      User,
      DailyAttendance,
    ]),
    ProjectModule,
  ],
  controllers: [RequestController],
  providers: [RequestService],
  exports: [RequestService],
})
export class RequestModule {}
