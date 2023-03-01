import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { CacheService } from './services/cache.service';
import { DomainService } from './services/domain.service';
import { EdgeService } from './services/edge.service';
import { RulesService } from './services/rules.service';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  providers: [
    AppService,
    EdgeService,
    DomainService,
    CacheService,
    RulesService,
  ],
})
export class AppModule {}
