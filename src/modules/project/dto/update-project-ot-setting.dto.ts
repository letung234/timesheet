import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectOtSettingDto } from './create-project-ot-setting.dto';

export class UpdateProjectOtSettingDto extends PartialType(
  CreateProjectOtSettingDto,
) {}
