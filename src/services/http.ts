import *  as SixIdeasConfig from '../app/app.config';

import { HttpClient, HttpHeaders, HttpHeaderResponse } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

type ResponseInterceptor = (response: any) => any;
type RequestInterceptor = (request: any) => any;
type ErrorInterceptor = (error: any) => any;

const absoluteURLPattern = /^((?:https:\/\/)|(?:http:\/\/)|(?:www))/;

@Injectable()
export class SixIdeasHTTPService {
  headers: any = '';

  private responseInterceptors: Array<ResponseInterceptor> = [];
  private requestInterceptors: Array<RequestInterceptor> = [];
  private errorInterceptors: Array<ErrorInterceptor> = [];

  constructor(
    public http: HttpClient,
    public storage: Storage

  ) { }

  public get<T>(url: string, options?: {}): Promise<any> {
    return this.http
      .get<T>(this.generateURL(url), this.generateOptions(options))
      .map(this.responseHandler, this)
      .catch(this.errorHandler.bind(this))
      .toPromise();
  }

  public post<T>(url: string, data: Object, options?: {}): Promise<any> {
    return this.http
      .post<T>(this.generateURL(url), this.prepareData(data), this.generateOptions(options))
      .map(this.responseHandler, this)
      .catch(this.errorHandler.bind(this))
      .toPromise();
  }

  public patch<T>(url: string, data: Object, options?: {}): Promise<any> {
    return this.http
      .patch(this.generateURL(url), this.prepareData(data), this.generateOptions(options))
      .map(this.responseHandler, this)
      .catch(this.errorHandler.bind(this))
      .toPromise();
    }

  public put<T>(url: string, data: Object, options?: {}): Promise<any> {
    return this.http
      .put(this.generateURL(url), this.prepareData(data), this.generateOptions(options))
      .map(this.responseHandler, this)
      .catch(this.errorHandler.bind(this))
      .toPromise();
    }

  public delete<T>(url: string, options?: {}): Promise<any> {
    return this.http
      .delete(this.generateURL(url), this.generateOptions(options))
      .map(this.responseHandler, this)
      .catch(this.errorHandler.bind(this))
      .toPromise();
    }

  protected prepareData(data: any): string {
    return this.requestInterceptors.reduce((acc, interceptor) => interceptor(acc), data);
  }

  protected responseHandler(resp: any): any {
    return this.responseInterceptors.reduce((acc: any, interceptor: any) => interceptor(acc), resp);
  }
  
  protected errorHandler(error: Response): any {
    return this.errorInterceptors.reduce((acc: any, interceptor: any) => interceptor(acc), error);
  }

  protected generateURL(url: string) {
    return url.match(absoluteURLPattern) ? url : SixIdeasConfig.url + url
  }

  protected generateOptions(options: any = {}) {
    if (!options.headers) {
      options.headers = this.headers;
    }

    Object.keys(this.headers)
      .filter((key) => this.headers.hasOwnProperty(key))
      .forEach((key) => {
        options.headers.set(key, this.headers[key]);
      });

    return options;
  }
}