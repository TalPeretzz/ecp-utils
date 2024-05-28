# HTTP Exception Filter

This module adds an HTTP exception filter to your application. It catches HTTP exceptions thrown by your application and sends an appropriate HTTP response to the client. and logs the error.

## Installation

```shell
npm i @elementor/ecp-utils-http-exception-filter
```

## Usage
In the app module add the following code:

```typescript
import { Module } from '@nestjs/common';
import { HttpExceptionModule } from '@elementor/ecp-utils-http-exception-filter';

Module({
  imports: [
    HttpExceptionModule.registerAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService<EnvironmentVariables, true>) => ({
            traceIdHeader: TRACE_ID_HEADER,
            isProd: configService.get('NODE_ENV', { infer: true }) === 'production',
            logSeverity: 'error', // can use 'error' or 'warn'
        }),
    }),
  ],
})