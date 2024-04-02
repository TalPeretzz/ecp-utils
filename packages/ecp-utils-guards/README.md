# ecp-utils-guards

`@elementor/ecp-utils-guards` is a utility package providing a set of guards for NestJS applications.

## Installation

```bash
npm @elementor/install ecp-utils-guards
```

## Guards

### ElementorTokenGuard
- `Elementor-Token-Guard`:  is a guard that validates Elementor tokens in incoming requests. It uses the Elementor token strategy to authenticate the requests based on the provided tokens. If the token is valid, the request is allowed to proceed; otherwise, the request is denied.

To use `ElementorTokenGuard`, import it in your module and then use the `@UseGuards` decorator in your controllers:

In the module
```typescript
ElementorTokenGuardModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService<EnvironmentVariables, true>) => ({
                issuer: configService.get('ELEMENTOR_TOKEN_ISSUER', { infer: true }),
                secretOrKey: configService.get('ELEMENTOR_TOKEN_PUBLIC_KEY', { infer: true }),
                algorithms: ['RS256'],
            }),
```
In the controller
```typescript
import { Controller, UseGuards } from '@nestjs/common';
import { ElementorTokenGuard } from '@elementor/ecp-utils-guards';

@Controller('my-route')
@UseGuards(ElementorTokenGuard)
@ApiBearerAuth()
export class MyController {
  // controller methods here
}
```
### ApiKeyGuard
- `Api-Key-Guard`:  is a guard that validates Elementor tokens in incoming requests. It uses the Elementor token strategy to authenticate the requests based on the provided tokens. If the token is valid, the request is allowed to proceed; otherwise, the request is denied..

To use `ApiKeyGuard`, import it in your module and then use the `@UseGuards` decorator in your controllers:

```typescript
ApiKeyGuardModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService<EnvironmentVariables, true>) => ({
                apiKey: configService.get('API_KEY', { infer: true }),
            }),
        }),
```

```typescript
import { Controller, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '@elementor/ecp-utils-guards';

@Controller('my-route')
@UseGuards(ApiKeyGuard)
@ApiSecurity('api-key')
export class MyController {
  // controller methods here
}
```
### BasicGuard
- `Basic-Guard`: is a guard that validates basic authentication credentials in incoming requests. It uses the basic authentication strategy to authenticate the requests based on the provided username and password. If the credentials are valid, the request is allowed to proceed; otherwise, the request is denied.

To use `BasicGuard`, import it in your module and then use the `@UseGuards` decorator in your controllers:

```typescript
BasicGuardModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService<EnvironmentVariables, true>) => ({
                username: configService.get('BASIC_AUTH_USERNAME', { infer: true }),
                password: configService.get('BASIC_AUTH_PASSWORD', { infer: true }),
            }),
        }),
```

```typescript
import { Controller, UseGuards } from '@nestjs/common';
import { BasicGuard } from '@elementor/ecp-utils-guards';

@Controller('my-route')
@UseGuards(BasicGuard)
@ApiSecurity('basic')
export class MyController {
  // controller methods here
}
```

### ChainGuard
- `Chain-Guard`: is a guard that uses a chain of other guards to validate incoming requests. It uses one of the two guards: `api-key` or `elementor-token`. When a request comes in, it will try to authenticate the request using each guard in order. If one guard fails, it will try the next one. If all guards fail, the request is denied.

To use `ChainGuard`, import it in your module and then use the `@UseGuards` decorator in your controllers:

```typescript
import { Controller, UseGuards } from '@nestjs/common';
import { ChainGuard } from '@elementor/ecp-utils-guards';

@Controller('my-route')
@UseGuards(ChainGuard)
@ApiBearerAuth()
@ApiSecurity('api-key')
export class MyController {
  // controller methods here
}

```

- `Store-Guard` is a guard that validates the Elementor Store tokens in the incoming requests. It uses the Elementor Store strategy to authenticate the requests based on the provided tokens. If the token is valid, the request is allowed to proceed; otherwise, the request is denied.

To use `ElementorStoreGuard`, import it in your module and then use the `@UseGuards` decorator in your controllers:

```typescript
import { Controller, UseGuards } from '@nestjs/common';
import { ElementorStoreGuard } from 'ecp-utils-guards';

@Controller('my-route')
@UseGuards(ChainGuard, ElementorStoreGuard)
export class MyController {
  // controller methods here
}
```
## Configuring Swagger
```typescript
const config = new DocumentBuilder()
            .setTitle(packageInfo.name)
            .setDescription(packageInfo.description)
            .setVersion(packageInfo.version)
            .addBearerAuth()
            .addSecurity('api-key', { type: 'apiKey', in: 'header', name: 'Authorization' })
            .addSecurity('basic', { type: 'http', scheme: 'basic' })
            .build();

```
This example shows how to configure Swagger to use all the guards in the API documentation.
Add only the ones that are necessary for your application in the `app.config.ts` file.

- `addBearerAuth()` is used to add the `Authorization` header to the Swagger UI for the `ElementorTokenGuard`.
- `addSecurity('api-key')` is used to add the `api-key` security scheme to the Swagger UI for the `ApiKeyGuard`.
- `addSecurity('basic')` is used to add the `basic` security scheme to the Swagger UI for the `BasicGuard`.