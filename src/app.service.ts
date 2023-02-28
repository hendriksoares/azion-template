import { Injectable } from '@nestjs/common';
import { loadavg } from 'os';
import { DomainService } from './services/domain.service';
import { EdgeService } from './services/edge.service';

@Injectable()
export class AppService {
  constructor(
    private readonly edgeService: EdgeService,
    private readonly domainService: DomainService,
  ) {}

  async run(): Promise<void> {
    try {
      const edge_app = await this.edgeService.create({
        name: 'teste nest 1',
        address: 'aziontemplate.wordpress.com',
        origin_host: 'aziontemplate.wordpress.com',
      });
      const domain = await this.domainService.create({
        id: edge_app.id,
        name: 'test nest domain 1',
      });
      console.log(domain);
    } catch (err) {
      console.error(err.data);
    }
  }
}
