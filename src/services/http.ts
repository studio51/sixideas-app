import *  as SixIdeasConfig from '../app/app.config';

import { HttpClient, HttpHeaders, HttpHeaderResponse } from '@angular/common/http';
// import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';

import { Injectable } from '@angular/core';

// TODO
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
// import 'rxjs/add/observable/from';
// import 'rxjs/add/observable/flatMap';

type ResponseInterceptor = (response: any) => any;
type RequestInterceptor = (request: any) => any;
type ErrorInterceptor = (error: any) => any;

const absoluteURLPattern = /^((?:https:\/\/)|(?:http:\/\/)|(?:www))/;

@Injectable()
export class SixIdeasHTTPService {
  protected _endpoint: string = SixIdeasConfig.endpoint;

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

  post<T>(url: string, data: Object, options?: {}): Promise<any> {
    return this.http
      .post<T>(this.generateURL(url), this.prepareData(data), this.generateOptions(options))
      .map(this.responseHandler, this)
      .catch(this.errorHandler.bind(this))
      .toPromise();
  }

  public patch<T>(url: string, data: Object, options?: {}): Promise<any> {
    return this.http
      .put(this.generateURL(url), this.prepareData(data), this.generateOptions(options))
      .map(this.responseHandler, this)
      .catch(this.errorHandler.bind(this))
      .toPromise();
    }

  // get<T>(url: string, options?: RequestOptionsArgs): Observable<T> {
  //   return this.token().flatMap((token) => {
  //     this.setHeader('token', token)
      
  //       return this.http.get(this.generateUrl(url), this.generateOptions(options))
  //         .map(this.responseHandler, this)
  //         .catch(this.errorHandler.bind(this))
  //   })
  // }

  // post<T>(url: string, data: Object, options?: RequestOptionsArgs): Observable<T> {
  //   const newData = this.prepareData(data);
    
  //   return this.token().flatMap((token) => {
  //     this.setHeader('token', token)

  //       return this.http.post(this.generateUrl(url), newData, this.generateOptions(options))
  //         .map(this.responseHandler, this)
  //         .catch(this.errorHandler.bind(this))
  //     })
  // }

  // put<T>(url: string, data: Object, options?: RequestOptionsArgs): Observable<T> {
  //   const newData = this.prepareData(data);
    
  //   return this.token().flatMap((token) => {
  //     this.setHeader('token', token)
     
  //       return this.http.put(this.generateUrl(url), newData, this.generateOptions(options))
  //         .map(this.responseHandler, this)
  //         .catch(this.errorHandler.bind(this))
  //     })
  // }

  // patch<T>(url: string, data: Object, options?: RequestOptionsArgs): Observable<T> {
  //   const newData = this.prepareData(data);
    
  //   return this.token().flatMap((token) => {
  //     this.setHeader('token', token)
        
  //       return this.http.put(this.generateUrl(url), newData, this.generateOptions(options))
  //         .map(this.responseHandler, this)
  //         .catch(this.errorHandler.bind(this))
  //     })
  // }

  // delete<T>(url: string, options?: RequestOptionsArgs): Observable<T> {
  //   return this.token().flatMap((token) => {
  //     this.setHeader('token', token)
        
  //       return this.http.delete(this.generateUrl(url), this.generateOptions(options))
  //         .map(this.responseHandler, this)
  //         .catch(this.errorHandler.bind(this))
  //     })
  // }

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
    return url.match(absoluteURLPattern) ? url : this._endpoint + url
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