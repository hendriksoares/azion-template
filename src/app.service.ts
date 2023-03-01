import { Injectable } from '@nestjs/common';
import { CacheService } from './services/cache.service';
import { DomainService } from './services/domain.service';
import { EdgeService } from './services/edge.service';
import { RulesService } from './services/rules.service';

@Injectable()
export class AppService {
  constructor(
    private readonly edgeService: EdgeService,
    private readonly domainService: DomainService,
    private readonly cacheService: CacheService,
    private readonly rulesService: RulesService,
  ) {}

  async run(): Promise<void> {
    try {
      /** register edge application */
      const edge_app = await this.edgeService.create({
        name: process.env.AZION_APP_NAME,
        address: process.env.AZION_ADDRESS,
        host_header: process.env.AZION_HOST_HEADER,
      });

      /** active application acceleration */
      await this.edgeService.update({
        id: edge_app.id,
      });

      /** create a domain to access application */
      await this.domainService.create({
        id: edge_app.id,
        name: process.env.AZION_APP_NAME,
      });

      /** set cache rules to 5 minute */
      const cache_5_min = await this.cacheService.create({
        id: edge_app.id,
        name: 'H0 5 min',
        cdn_cache_settings_maximum_ttl: 300,
      });

      /** set cache rules to 15 days */
      const cache_15_days = await this.cacheService.create({
        id: edge_app.id,
        name: 'H0 15 days',
        cdn_cache_settings_maximum_ttl: 1296000,
      });

      /** set cache rules to 365 days */
      const cache_1_year = await this.cacheService.create({
        id: edge_app.id,
        name: 'H0 365 days',
        cdn_cache_settings_maximum_ttl: 31536000,
      });

      /** set static cache rules */
      await this.rulesService.create({
        id: edge_app.id,
        phase: 'request',
        name: 'images',
        cache_id: cache_15_days.id,
        input_value:
          '\\.(aif|aiff|au|avi|bin|cab|carb|cct|cdf|class|doc|dcr|dtd|exe|flv|gcf|gff|grv|hdml|hqx|ini|mov|mp3|nc|pct|pdf|ppc|pws|swa|swf|txt|vbs|w32|wav|wbmp|wml|wmlc|wmls|wmlsc|xsd|zip|jxr|hdp|wdp|pict|mid|midi|ttf|eof|otf|svgz|jar)$',
      });

      /** set images cache rules */
      await this.rulesService.create({
        id: edge_app.id,
        phase: 'request',
        name: 'static',
        cache_id: cache_1_year.id,
        input_value: '\\.(jpg|jpeg|bmp|ico|gif|png)$',
      });

      /** set default cache rules */
      await this.rulesService.create({
        id: edge_app.id,
        phase: 'request',
        name: 'content',
        cache_id: cache_5_min.id,
        input_value: '\\.(html|js|css|index|php)$',
      });
    } catch (err) {
      console.error(err.response.data);
    }
  }
}
