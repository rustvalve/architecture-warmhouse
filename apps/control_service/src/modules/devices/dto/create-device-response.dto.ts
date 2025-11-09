import { DeviceStatus, DeviceType } from 'src/modules/devices/types/types';

export class CreateDeviceResponseDto {
  success: boolean;
  message: string;
  deviceId: string;
  userId: string;
  deviceType: DeviceType;
  status: DeviceStatus;
  createdAt: Date;
}
