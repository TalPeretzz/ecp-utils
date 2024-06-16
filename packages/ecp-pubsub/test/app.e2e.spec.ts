import { EventEnvelope } from '@elementor/example-schema';
import { HttpStatus } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { setTimeout } from 'timers/promises';
import { AppModule } from './mock-app/app.module';
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

    const event: EventEnvelope = {
      metadata: {
        eventName: 'CREATED',
        eventId: 'id',
        eventSource: 'test',
        timestamp: 1713195615942,
      },
      example: {
        billingInfo: {
          billingId: 'id',
          billingName: 'name',
        },
        description: 'description',
        id: 'id',
        name: 'name',
        status: 'status',
        createdBy: 'createdBy',
      },
    };

    expect(mySpy).toHaveBeenCalledWith(event, expect.anything());
  });
});
