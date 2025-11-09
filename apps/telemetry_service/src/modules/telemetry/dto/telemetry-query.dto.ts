import {
  IsUUID,
  IsDateString,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TelemetryQueryDto {
  @IsUUID()
  deviceId: string;

  @IsDateString()
  from: string;

  @IsDateString()
  to: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  limit?: number = 100;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
