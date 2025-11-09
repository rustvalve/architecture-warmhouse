import { DeviceStatus, DeviceType } from 'src/modules/devices/types/types';

export class DeviceStatusDto {
  deviceId: string;
  deviceType: DeviceType;
  status: DeviceStatus;
  state: Record<string, any>;
  updatedAt: Date;
}
