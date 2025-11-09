import { DeviceType } from 'src/modules/devices/types/types';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateDeviceDto {
  @IsNotEmpty()
  @IsString()
  deviceId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsEnum(DeviceType)
  deviceType: DeviceType;
}
