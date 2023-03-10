import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class CacheService {
  url: string;
  token: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.url = `${this.configService.get<string>(
      'AZION_API_URL',
    )}/edge_applications/:edge_application_id/cache_settings`;
    this.token = this.configService.get<string>('AZION_PERSONAL_TOKEN');
  }

  async create(input: any): Promise<any> {
    Logger.debug('Register a new cache rule', 'CacheService');

    const { id, cdn_cache_settings_maximum_ttl, name } = input;

    /** replace edge application id */
    this.url = this.url.replace(':edge_application_id', id);

    const data = {
      name,
      browser_cache_settings: 'override',
      browser_cache_settings_maximum_ttl: 0,
      cdn_cache_settings: 'override',
      cdn_cache_settings_maximum_ttl,
      cache_by_query_string: 'ignore',
      query_string_fields: [],
      enable_query_string_sort: false,
      cache_by_cookies: 'ignore',
      cookie_names: [],
      enable_caching_for_post: false,
      enable_caching_for_options: false,
      l2_caching_enabled: false,
      is_slice_configuration_enabled: false,
      is_slice_edge_caching_enabled: false,
      is_slice_l2_caching_enabled: false,
      slice_configuration_range: 1024,
    };

    const config = {
      headers: {
        Accept: 'application/json; version=3',
        Authorization: `Token ${this.token}`,
        'Content-Type': 'application/json',
      },
    };

    const result = await firstValueFrom(
      this.httpService
        .post(this.url, data, config)
        .pipe(map((x) => x.data.results)),
    );

    return result;
  }
}
