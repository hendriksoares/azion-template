import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class EdgeService {
  url: string;
  token: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.url = `${this.configService.get<string>(
      'AZION_API_URL',
    )}/edge_applications`;
    this.token = this.configService.get<string>('AZION_PERSONAL_TOKEN');
  }

  async create(input: any): Promise<void> {
    const { name, address, host_header } = input;

    const data = {
      name,
      delivery_protocol: 'http',
      origin_type: 'single_origin',
      address,
      origin_protocol_policy: 'preserve',
      host_header,
      browser_cache_settings: 'override',
      browser_cache_settings_maximum_ttl: 20,
      cdn_cache_settings: 'honor',
      cdn_cache_settings_maximum_ttl: 60,
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

    console.log(result);
  }
}
