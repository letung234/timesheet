import { IsArray, IsNumber, ArrayMinSize } from 'class-validator';

export class AssignPermissionsDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  permissionIds: number[];
}
