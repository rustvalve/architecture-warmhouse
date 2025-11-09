import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { CommandType } from 'src/modules/devices/types/types';

export class CommandRequestDto {
  @IsNotEmpty()
  @IsEnum(CommandType)
  command: CommandType;

  @IsOptional()
  @IsNumber()
  value?: number;
}
