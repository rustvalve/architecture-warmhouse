import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { TelemetryModule } from 'src/modules/telemetry/telemetry.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'telemetry',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // TODO: Disable in production
    }),
    TelemetryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
