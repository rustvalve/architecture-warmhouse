import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CommandType } from 'src/modules/devices/types/types';

export class CommandRequestDto {
  @IsNotEmpty()
  @IsString()
  deviceId: string;

  @IsNotEmpty()
  @IsEnum(CommandType)
  command: CommandType;

  @IsOptional()
  @IsNumber()
  value?: number;
}
