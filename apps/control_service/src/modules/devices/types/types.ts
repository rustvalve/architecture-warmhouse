export enum DeviceType {
  HEATING = 'HEATING',
  LIGHTING = 'LIGHTING',
  GATE = 'GATE',
}

export enum DeviceStatus {
  ACTIVE = 'ACTIVE',
  IDLE = 'IDLE',
  ERROR = 'ERROR',
  OFFLINE = 'OFFLINE',
  UPDATING = 'UPDATING',
  DELETED = 'DELETED',
  DISABLED = 'DISABLED',
}

export enum CommandType {
  TURN_ON = 'TURN_ON',
  TURN_OFF = 'TURN_OFF',
  SET_VALUE = 'SET_VALUE',
}

export interface CommandResponse {
  success: boolean;
  message: string;
  status: DeviceStatus;
}
