import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';

import { AppModule } from './mock-app/app.module';
import { AppAsyncModule } from './mock-app/app-async.module';
import { HttpStatus } from '@nestjs/common';
import nock from 'nock';

describe('End-to-end module testing by using mock application', () => {
  describe('Module configured sync', () => {
    let app: NestFastifyApplication;

    beforeAll(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
      await app.init();
    });

    afterAll(async () => {
      await app.close();
    });

    it('GET app/test', async () => {
      const baseUrl = 'https://some-no-matter-what-url.com';
      const path = '/test';
      nock(baseUrl).get(path).reply(HttpStatus.OK, { foo: 'bar' });

      const res = await app.inject({
        method: 'GET',
        url: '/app/test',
      });
      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(JSON.parse(res.body)).toEqual({ foo: 'bar' });
    });
  });

  describe('Module configured async', () => {
    let app: NestFastifyApplication;

    beforeAll(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [AppAsyncModule],
      }).compile();

      app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
      await app.init();
    });

    afterAll(async () => {
      await app.close();
    });

    it('GET app/test', async () => {
      const baseUrl = 'https://some-no-matter-what-url.com';
      const path = '/test';
      nock(baseUrl).get(path).reply(HttpStatus.OK, { foo: 'bar' });

      const res = await app.inject({
        method: 'GET',
        url: '/app/test',
      });
      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(JSON.parse(res.body)).toEqual({ foo: 'bar' });
    });
  });
});
