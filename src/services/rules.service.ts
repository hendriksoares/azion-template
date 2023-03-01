import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class RulesService {
  url: string;
  token: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.url = `${this.configService.get<string>(
      'AZION_API_URL',
    )}/edge_applications/:edge_application_id/rules_engine/:phase/rules`;
    this.token = this.configService.get<string>('AZION_PERSONAL_TOKEN');
  }

  async create(input: any): Promise<any> {
    Logger.debug('Register a new rules engine', 'DomainService');
    const { id, phase, name, cache_id, input_value } = input;

    /** replace edge application id and phase */
    this.url = this.url.replace(':edge_application_id', id);
    this.url = this.url.replace(':phase', phase);

    const data = {
      name,
      criteria: [
        [
          {
            conditional: 'if',
            variable: '${uri}',
            operator: 'matches',
            input_value,
          },
          {
            conditional: 'and',
            variable: '${uri}',
            operator: 'does_not_start_with',
            input_value: '/wp-',
          },
        ],
      ],
      behaviors: [
        {
          name: 'set_cache_policy',
          target: cache_id,
        },
      ],
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

    return;
  }
}
