import { Module } from '@nestjs/common';
import { HttpModule } from '../../src/http.module';

import { AppController } from './app.controller';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://some-no-matter-what-url.com',
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
