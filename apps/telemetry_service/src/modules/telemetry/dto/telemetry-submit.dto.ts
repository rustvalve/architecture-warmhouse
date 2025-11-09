import { IsUUID, IsObject, IsNotEmpty } from 'class-validator';

export class TelemetrySubmitDto {
  @IsUUID()
  @IsNotEmpty()
  deviceId: string;

  @IsObject()
  @IsNotEmpty()
  data: Record<string, any>;
}
