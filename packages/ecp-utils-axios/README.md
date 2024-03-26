# Elementor Http Client
This module is wrapper for @nestjs/axios module. 
It preserves @nestjs/axios's API and configuration style.

## Installation
```shell
npm i @elementor/axios
```

## Configuration
The module wraps @nestjs/axios module, so all config options
you provide to the axios module are also valid here.

```shell
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [CatsService],
})
export class CatsModule {}
```

## Async configuration
```shell
HttpModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    timeout: configService.get('HTTP_TIMEOUT'),
    maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
  }),
  inject: [ConfigService],
});
```

Alternatively, you can configure the HttpModule using a class instead of a factory, as shown below.

```shell
HttpModule.registerAsync({
  useClass: HttpConfigService,
});
```

The construction above instantiates HttpConfigService inside HttpModule, using it to create an options object. Note that in this example, the HttpConfigService has to implement HttpModuleOptionsFactory interface as shown below. The HttpModule will call the createHttpOptions() method on the instantiated object of the supplied class.

```shell
@Injectable()
class HttpConfigService implements HttpModuleOptionsFactory {
  createHttpOptions(): HttpModuleOptions {
    return {
      timeout: 5000,
      maxRedirects: 5,
    };
  }
}
```
