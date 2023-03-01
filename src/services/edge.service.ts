import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class EdgeService {
  url: string;
  token: string;
  config: any;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.url = `${this.configService.get<string>(
      'AZION_API_URL',
    )}/edge_applications`;
    this.token = this.configService.get<string>('AZION_PERSONAL_TOKEN');
    this.config = {
      headers: {
        Accept: 'application/json; version=3',
        Authorization: `Token ${this.token}`,
        'Content-Type': 'application/json',
      },
    };
  }

  async create(input: any): Promise<any> {
    Logger.debug('Create a new edge application', 'EdgeService');
    const { name, address, host_header } = input;

    const data = {
      name,
      delivery_protocol: 'http,https',
      origin_type: 'single_origin',
      address,
      origin_protocol_policy: 'preserve',
      host_header,
      browser_cache_settings: 'override',
      browser_cache_settings_maximum_ttl: 20,
      cdn_cache_settings: 'honor',
      cdn_cache_settings_maximum_ttl: 60,
      application_acceleration: true,
    };

    const result = await firstValueFrom(
      this.httpService
        .post(this.url, data, this.config)
        .pipe(map((x) => x.data.results)),
    );

    return result;
  }

  async update(input: any): Promise<any> {
    const { id } = input;

    const data = {
      id,
      delivery_protocol: 'http,https',
      http_port: 80,
      https_port: 443,
      minimum_tls_version: '',
      active: true,
      application_acceleration: true,
      caching: true,
      device_detection: false,
      edge_firewall: false,
      edge_functions: false,
      image_optimization: false,
      l2_caching: false,
      load_balancer: false,
      raw_logs: false,
      web_application_firewall: false,
    };

    const result = await firstValueFrom(
      this.httpService
        .patch(`${this.url}/${id}`, data, this.config)
        .pipe(map((x) => x.data.results)),
    );

    return result;
  }
}
