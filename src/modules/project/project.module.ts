import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectMember } from './entities/project-member.entity';
import { ProjectOtSetting } from './entities/project-ot-setting.entity';
import { Customer } from './entities/customer.entity';
import { User } from '../users/entities/user.entity';
import { ProjectService } from './services/project.service';
import { ProjectController } from './controllers/project.controller';
import { CustomerService } from './services/customer.service';
import { CustomerController } from './controllers/customer.controller';
import { ProjectOtSettingService } from './services/project-ot-setting.service';
import { ProjectOtSettingController } from './controllers/project-ot-setting.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ProjectMember,
      ProjectOtSetting,
      Customer,
      User,
    ]),
  ],
  controllers: [
    ProjectController,
    CustomerController,
    ProjectOtSettingController,
  ],
  providers: [ProjectService, CustomerService, ProjectOtSettingService],
  exports: [ProjectService, CustomerService, ProjectOtSettingService],
})
export class ProjectModule {}
