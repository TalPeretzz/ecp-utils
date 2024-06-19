# ecp-utils-logger

`@elementor/ecp-utils-logger` is a utility package providing a set of logger utils for NestJS applications.

## Installation

```bash
npm i @elementor/ecp-utils-logger
```

## How to use
Add the following code to your `app.module.ts` file:
```typescript
LoggerModule.forRootAsync({
            inject: [LoggerUtils],
            providers: [
                LoggerUtils,
                {
                    provide: LoggerModuleToken,
                    useFactory: (configService: ConfigService<EnvironmentVariables, true>) => ({
                        logLevel: configService.get('LOG_LEVEL', { infer: true }),
                        loggerPretty: configService.get('LOGGER_PRETTY', { infer: true }),
                        loggerRedactedFields: configService.get('LOGGER_REDACTED_FIELDS', { infer: true }),
                        traceExcludedRoutes: configService.get('TRACE_EXCLUDED_ROUTES', { infer: true }),
                    }),
                    inject: [ConfigService],
                },
            ],
            useFactory: (loggerUtils: LoggerUtils) => {
                return {
                    pinoHttp: {
                        level: loggerUtils.options.logLevel,
                        transport: loggerUtils.transport(),
                        redact: loggerUtils.redact(),
                        formatters: loggerUtils.loggerFormatters(),
                        serializers: loggerUtils.loggerSerializers(),
                        customSuccessMessage: loggerUtils.loggerCustomMessage,
                        customErrorMessage: loggerUtils.loggerCustomMessage,
                        customProps: loggerUtils.loggerCustomProps,
                    },
                    exclude: loggerUtils.loggerExclude(),
                };
            },
```

Select what is best for your application.
Here are some options to consider:
- Use the `LoggerModule.forRootAsync` method to configure the logger with custom options.
- Set the log level, transport, redaction, formatters, serializers, custom messages, and custom properties using the `pinoHttp` object.
- Exclude specific routes from being logged using the `exclude` property.

```typescript
return {
            pinoHttp: {
                level: loggerUtils.options.logLevel,
                transport: loggerUtils.transport(),
                redact: loggerUtils.redact(),
                formatters: loggerUtils.loggerFormatters(),
                serializers: loggerUtils.loggerSerializers(),
                customSuccessMessage: loggerUtils.loggerCustomMessage,
                customErrorMessage: loggerUtils.loggerCustomMessage,
                customProps: loggerUtils.loggerCustomProps,
            },
            exclude: loggerUtils.loggerExclude(),
        };
```