# ecp-utils-http-metrics

`@elementor/ecp-utils-http-metrics` is a package that provides a http requests metrics middleware.

## Installation

```bash
npm  i @elementor/ecp-utils-http-metrics
```

## How to use
Import the `HttpMetricsModule` and `HttpMetricsMiddleware` in your `app.module.ts` file.
```typescript
import { HttpMetricsMiddleware, HttpMetricsModule } from '@elementor/ecp-utils-http-metrics';
```

Add the following code to your `app.module.ts` file in the `imports` section:
```typescript
HttpMetricsModule.register({
    name: 'ecp_app_name_requests', // name of the metric (use snake_case for the name)
    help: 'HTTP metrics for app_name requests',
}),
```

Add the following code to your `app.module.ts` file in the AppModule configure method:
```typescript
consumer
    .apply(HttpMetricsMiddleware)
    .exclude(...this.excludedRoutes)
    .forRoutes('*');
```

You can see the metrics in the `/metrics` endpoint of your application.
The metrics will be in the following format:
```bash
# HELP ecp_order_requests HTTP metrics for order requests
# TYPE ecp_order_requests histogram
ecp_order_requests_bucket{le="1",endpoint="/order/api/v1/:orderNumber",status="200"} 0
ecp_order_requests_bucket{le="10",endpoint="/order/api/v1/:orderNumber",status="200"} 0
ecp_order_requests_bucket{le="100",endpoint="/order/api/v1/:orderNumber",status="200"} 0
ecp_order_requests_bucket{le="500",endpoint="/order/api/v1/:orderNumber",status="200"} 0
ecp_order_requests_bucket{le="1000",endpoint="/order/api/v1/:orderNumber",status="200"} 1
ecp_order_requests_bucket{le="5000",endpoint="/order/api/v1/:orderNumber",status="200"} 1
ecp_order_requests_bucket{le="10000",endpoint="/order/api/v1/:orderNumber",status="200"} 1
ecp_order_requests_bucket{le="+Inf",endpoint="/order/api/v1/:orderNumber",status="200"} 1
ecp_order_requests_sum{endpoint="/order/api/v1/:orderNumber",status="200"} 765.8233330000003
ecp_order_requests_count{endpoint="/order/api/v1/:orderNumber",status="200"} 1
ecp_order_requests_bucket{le="1",endpoint="/order/api/v1/:orderNumber",status="401"} 0
ecp_order_requests_bucket{le="10",endpoint="/order/api/v1/:orderNumber",status="401"} 2
ecp_order_requests_bucket{le="100",endpoint="/order/api/v1/:orderNumber",status="401"} 2
ecp_order_requests_bucket{le="500",endpoint="/order/api/v1/:orderNumber",status="401"} 2
ecp_order_requests_bucket{le="1000",endpoint="/order/api/v1/:orderNumber",status="401"} 2
ecp_order_requests_bucket{le="5000",endpoint="/order/api/v1/:orderNumber",status="401"} 2
ecp_order_requests_bucket{le="10000",endpoint="/order/api/v1/:orderNumber",status="401"} 2
ecp_order_requests_bucket{le="+Inf",endpoint="/order/api/v1/:orderNumber",status="401"} 2
ecp_order_requests_sum{endpoint="/order/api/v1/:orderNumber",status="401"} 10.259874999999738
ecp_order_requests_count{endpoint="/order/api/v1/:orderNumber",status="401"} 2
```