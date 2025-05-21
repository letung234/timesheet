import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyAttendance } from './entities/daily_attendance.entity';
import { User } from '../users/entities/user.entity';
import { Project } from '../project/entities/project.entity';
import { Task } from '../task/entities/task.entity';
import { TimesheetService } from './services/timesheet.service';
import { TimesheetController } from './controllers/timesheet.controller';
import { WorkingTime } from './entities/working-time.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DailyAttendance,
      User,
      Project,
      Task,
      WorkingTime,
    ]),
  ],
  controllers: [TimesheetController],
  providers: [TimesheetService],
  exports: [TimesheetService],
})
export class TimesheetModule {}
