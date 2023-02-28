import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { DomainService } from './services/domain.service';
import { EdgeService } from './services/edge.service';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  providers: [AppService, EdgeService, DomainService],
})
export class AppModule {}
