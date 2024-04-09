import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { AppModule } from './mock-app/app.module';
import { HttpStatus } from '@nestjs/common';
import { setTimeout } from 'timers/promises';
import { TestController } from './mock-app/test.controller';

describe('End-to-end module testing by using mock application', () => {
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
    const mySpy = jest.spyOn(TestController.prototype, 'handle').mockImplementation();
    const res = await app.inject({
      method: 'GET',
      url: '/',
    });
    expect(res.statusCode).toBe(HttpStatus.OK);
    expect(JSON.parse(res.body)).toEqual({ success: true });

    await setTimeout(1000);

    expect(mySpy).toBeCalledWith({
      metadata: {
        eventName: 'POC_CREATED',
        eventId: 'id',
      },
      poc: {
        createdBy: 'createdBy',
        id: '1',
        name: 'name',
        description: 'description',
        status: 'status',
        newField: null,
      },
    });
  });
});
