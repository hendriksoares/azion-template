import { Injectable } from '@nestjs/common';
import { EdgeService } from './services/edge.service';

@Injectable()
export class AppService {
  constructor(private readonly edgeService: EdgeService) {}
  run(): void {
    this.edgeService.create({
      name: 'teste nest',
      address: 'aziontemplate.wordpress.com',
      origin_host: 'aziontemplate.wordpress.com',
    });
  }
}
