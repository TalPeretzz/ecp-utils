import { Inject, Injectable, NestMiddleware, RequestMethod } from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA, VERSION_METADATA } from '@nestjs/common/constants';
import { ApplicationConfig, DiscoveryService, Reflector } from '@nestjs/core';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Histogram } from 'prom-client';
import { HttpMetricsModuleToken } from './http-metrics.module-definition';
import { RadixTree } from './utils/radix-tree';

@Injectable()
export class HttpMetricsMiddleware implements NestMiddleware {
  private readonly endpointsTree: RadixTree;

  constructor(
    @Inject(HttpMetricsModuleToken) private readonly histogram: Histogram,
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly appConfig: ApplicationConfig,
  ) {
    this.endpointsTree = new RadixTree();
    const endpoints = this.getAllEndpoints();
    endpoints.forEach((endpoint) => this.endpointsTree.insert(endpoint));
  }

  use(request: FastifyRequest['raw'], reply: FastifyReply['raw'], next: () => void) {
    const startTime = performance.now();

    reply.on('finish', () => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      this.histogram.observe({ endpoint: this.getEndpoint(request.url!), status: reply.statusCode }, responseTime);
    });

    next();
  }

  /**
   * Returns the endpoint of the request by replacing the values of the params with the param name
   * @example  /user/123 -> /user/:id
   */
  private getEndpoint(requestUrl: string) {
    const urlWithoutQuery = requestUrl.split('?')[0];
    return this.endpointsTree.search(urlWithoutQuery)?.route ?? '/';
  }

  private getAllEndpoints() {
    const endpoints = [] as string[];
    const controllers = this.discoveryService.getControllers();
    controllers.forEach((wrapper) => {
      const { instance } = wrapper;
      if (instance) {
        const controllerPath = this.reflector.get<string>(PATH_METADATA, instance.constructor);
        const version = this.reflector.get<string>(VERSION_METADATA, instance.constructor);
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(instance));
        methods.forEach((methodName) => {
          const methodHandler = instance[methodName];
          const methodPath = this.reflector.get<string>(PATH_METADATA, methodHandler);
          const requestMethod = this.reflector.get<RequestMethod>(METHOD_METADATA, methodHandler);
          const method = RequestMethod[requestMethod];
          if (method) {
            endpoints.push(this.formatEndpoint(version, controllerPath, methodPath));
          }
        });
      }
    });

    return endpoints;
  }

  private formatEndpoint(version: string, controllerPath: string, methodPath: string) {
    const formattedControllerPath = controllerPath.startsWith('/') ? controllerPath : `/${controllerPath}`;
    const formattedMethodPath = methodPath.replace(/^\/|\/$/g, '');
    const globalPrefix = this.appConfig.getGlobalPrefix();
    const globalPrefixOptions = this.appConfig.getGlobalPrefixOptions();

    // TODO: Add versioning support
    // const versioning = this.appConfig.getVersioning();

    if (!globalPrefix) {
      return version
        ? `/v${version}${formattedControllerPath}${formattedMethodPath}`
        : `${formattedControllerPath}${formattedMethodPath}`;
    }

    if (globalPrefixOptions?.exclude) {
      for (const { pathRegex } of globalPrefixOptions.exclude) {
        if (formattedControllerPath.match(pathRegex)) {
          return version
            ? `/v${version}${formattedControllerPath}${formattedMethodPath}`
            : `${formattedControllerPath}${formattedMethodPath}`;
        }
      }
    }

    return version
      ? `/${globalPrefix}/v${version}${formattedControllerPath}${formattedMethodPath}`
      : `${formattedControllerPath}${formattedMethodPath}`;
  }
}
