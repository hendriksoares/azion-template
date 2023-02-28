import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class DomainService {
  url: string;
  token: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.url = `${this.configService.get<string>('AZION_API_URL')}/domains`;
    this.token = this.configService.get<string>('AZION_PERSONAL_TOKEN');
  }

  async create(input: any): Promise<void> {
    console.log('Creating a new domain ...');

    const { id, name } = input;

    const data = {
      name,
      cnames: [],
      cname_access_only: false,
      digital_certificate_id: null,
      edge_application_id: id,
      is_active: true,
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
