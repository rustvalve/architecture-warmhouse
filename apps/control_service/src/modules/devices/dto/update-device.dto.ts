import { IsEnum, IsObject, IsOptional } from 'class-validator';
import { DeviceStatus } from 'src/modules/devices/types/types';

export class UpdateDeviceDto {
  @IsOptional()
  @IsEnum(DeviceStatus)
  status?: DeviceStatus;

  @IsObject()
  @IsOptional()
  state?: Record<string, any>;
}
