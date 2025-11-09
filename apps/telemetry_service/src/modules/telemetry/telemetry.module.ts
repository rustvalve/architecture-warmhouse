import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelemetryController } from 'src/modules/telemetry/telemetry.controller';
import { TelemetryService } from 'src/modules/telemetry/telemetry.service';
import { Telemetry } from 'src/modules/telemetry/entities/telemetry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Telemetry])],
  controllers: [TelemetryController],
  providers: [TelemetryService],
})
export class TelemetryModule {}
