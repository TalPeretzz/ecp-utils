import { Injectable, Logger } from '@nestjs/common';
import { HttpService as NestHttpService } from '@nestjs/axios';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Observable } from 'rxjs';

@Injectable()
export class HttpService {
  private logger = new Logger(HttpService.name);

  constructor(private readonly httpService: NestHttpService) {
    httpService.axiosRef.interceptors.request.use(this.onRequest.bind(this));
    httpService.axiosRef.interceptors.response.use(this.onResponse.bind(this));
  }

  setLogger(logger: Logger) {
    this.logger = logger;
  }

  /**
   * Gets the Axios instance used for making HTTP requests.
   * This Axios instance methods return Promises.
   */
  get axiosRef(): AxiosInstance {
    return this.httpService.axiosRef;
  }

  request<T>(config: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    return this.httpService.request(config);
  }

  get<T>(url: string, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    return this.httpService.get(url, config);
  }

  delete<T>(url: string, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    return this.httpService.delete(url, config);
  }

  head<T>(url: string, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    return this.httpService.head(url, config);
  }

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    return this.httpService.post(url, data, config);
  }

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    return this.httpService.put(url, data, config);
  }

  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    return this.httpService.patch(url, data, config);
  }

  onResponse(response: AxiosResponse): AxiosResponse {
    const logData = {
      msg: 'Got HTTP response',
      response: response.data,
    };
    this.logger.debug(logData);
    return response;
  }

  onRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    const logData = {
      msg: 'Performing HTTP request',
      url: config.url,
      method: config.method,
      params: config.params,
      data: config.data,
    };

    this.logger.debug(logData);
    return config;
  }
}
