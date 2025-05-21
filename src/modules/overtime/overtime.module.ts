import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OvertimeRecordService } from './services/overtime-record.service';
import { OvertimeRecordController } from './controllers/overtime-record.controller';
import { OvertimeRecord } from './entities/overtime-record.entity';
import { Project } from '../project/entities/project.entity';
import { User } from '../users/entities/user.entity';
import { DailyAttendance } from '../timesheet/entities/daily_attendance.entity';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OvertimeRecord, Project, User, DailyAttendance]),
    ProjectModule,
  ],
  controllers: [OvertimeRecordController],
  providers: [OvertimeRecordService],
  exports: [OvertimeRecordService],
})
export class OvertimeModule {}
