import { HttpService } from './http.service';
import nock from 'nock';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule as NestHttpModule } from '@nestjs/axios';
import { HttpStatus, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

describe('HttpClient', () => {
  let sut: HttpService;
  let logger: Logger;

  afterEach(() => {
    nock.cleanAll();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NestHttpModule],
      providers: [
        HttpService,
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            debug: jest.fn(),
          },
        },
      ],
    }).compile();

    sut = module.get<HttpService>(HttpService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should actually call (Promise)', async () => {
    const baseUrl = 'https://some-base-url.com';
    const path = '/some/path';
    const scope = nock(baseUrl).post(path).reply(HttpStatus.OK);

    await sut.axiosRef.post(`${baseUrl}${path}`);

    expect(scope.isDone()).toBeTruthy();
  });

  it('should actually call (Observable)', async () => {
    const baseUrl = 'https://some-base-url.com';
    const path = '/some/path';
    const scope = nock(baseUrl).post(path).reply(HttpStatus.OK, { foo: 'bar' });

    const { data } = await firstValueFrom(sut.post<{ foo: string }>(`${baseUrl}${path}`));

    expect(scope.isDone()).toBeTruthy();
    expect(data.foo).toEqual('bar');
  });

  it('should log', async () => {
    const baseUrl = 'https://some-base-url.com';
    const path = '/some/path';
    nock(baseUrl).post(path).reply(HttpStatus.OK);

    sut.setLogger(logger);

    await sut.axiosRef.post(`${baseUrl}${path}`);
    expect(logger.debug).toHaveBeenCalledTimes(2);
    expect(logger.debug).toHaveBeenCalledWith({
      msg: 'Performing HTTP request',
      data: undefined,
      method: 'post',
      url: `${baseUrl}${path}`,
      params: undefined,
    });
    expect(logger.debug).toHaveBeenCalledWith({
      msg: 'Got HTTP response',
      response: '',
    });
  });
});
