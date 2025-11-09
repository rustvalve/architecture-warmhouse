import { IsEnum, IsNotEmpty } from 'class-validator';
import { DeviceStatus } from 'src/modules/devices/types/types';

export class UpdateDeviceDto {
  @IsNotEmpty()
  @IsEnum(DeviceStatus)
  status: DeviceStatus;
}
