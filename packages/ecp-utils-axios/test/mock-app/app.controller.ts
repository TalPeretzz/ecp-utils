import { Controller, Get } from '@nestjs/common';
import { HttpService } from '../../src/http.service';

@Controller('app')
export class AppController {
  constructor(private readonly http: HttpService) {}

  @Get('test')
  async testAction() {
    return this.http.axiosRef.get('test').then((res) => res.data);
  }
}
