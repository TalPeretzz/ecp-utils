import { HttpStatus } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { setTimeout } from 'timers/promises';
import { TestController } from './mock-app/app-with-no-schema-test.controller';
import { AppModule } from './mock-app/app-with-no-schema.module';

describe('End-to-end module testing by using mock app-with-no-schema', () => {
  let app: NestFastifyApplication;

  afterEach(() => {
    jest.restoreAllMocks();
  });

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

  it('GET /', async () => {
    const mySpy = jest.spyOn(TestController.prototype, 'handleWithoutSchema').mockImplementation();
    const res = await app.inject({
      method: 'GET',
      url: '/',
    });
    expect(res.statusCode).toBe(HttpStatus.OK);
    expect(JSON.parse(res.body)).toEqual({ success: true });

    await setTimeout(1000);

    expect(mySpy).toHaveBeenCalledWith('I can be anything');
  });
});
