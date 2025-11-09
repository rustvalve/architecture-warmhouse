export class TelemetryListResponseDto {
  deviceId: string;
  from: string;
  to: string;
  total: number;
  limit: number;
  offset: number;
  data: Record<string, any>;
}
