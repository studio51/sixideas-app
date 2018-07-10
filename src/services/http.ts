import *  as SixIdeasConfig from '../app/app.config';

import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http';
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
  private headers: any = {};
  protected _endpoint: string = SixIdeasConfig.endpoint;

  // Response interceptors which are fired on every response
  // 
  private responseInterceptors: Array<ResponseInterceptor> = [];

  // Request interceptors which are fired on every response
  // 
  private requestInterceptors: Array<RequestInterceptor> = [];

  // Error interceptors which are fired on every response
  // 
  private errorInterceptors: Array<ErrorInterceptor> = [];

  constructor(
    protected http: Http,
    public storage: Storage

  ) {
  
    this.addResponseInterceptor(this.defaultResponseInterceptor);
    this.addRequestInterceptor(this.defaultRequestInterceptor);
    this.addErrorInterceptor(this.defaultErrorInterceptor);
  }

  protected defaultResponseInterceptor(resp: Response): any {
    if (typeof resp.json === 'function') {
      return resp.json()
    }

    if (typeof resp.text === 'function') {
      return resp.text()
    }

    return resp
  }

  protected defaultRequestInterceptor(req: any): string {
    return JSON.stringify(req)
  }

  protected defaultErrorInterceptor(resp: Response): any {
    let data;

    if (typeof resp.json === 'function') {
      data = resp.json()
    } else {
      data = resp.statusText
    }

    return { status: resp.status, data }
  }

  setHeader(key: string, value: string) {
    this.headers[key] = value
  }

  getHeaderByKey(key: string) {
    return this.headers[key]
  }

  addResponseInterceptor<T, S>(interceptor: (arg: T) => S): void {
    this.responseInterceptors = [ ...this.responseInterceptors, interceptor ]
  }

  addErrorInterceptor<T, S>(interceptor: (arg: T) => S): void {
    this.errorInterceptors = [ ...this.errorInterceptors, interceptor ]
  }

  addRequestInterceptor<T, S>(interceptor: (arg: T) => S): void {
    this.requestInterceptors = [ interceptor, ...this.requestInterceptors ]
  }

  removeHeader(key: string) {
    delete this.headers[key]
  }

  get<T>(url: string, options?: RequestOptionsArgs): Observable<T> {
    return this.token().flatMap((token) => {
      this.setHeader('token', token)
      
        return this.http.get(this.generateUrl(url), this.generateOptions(options))
          .map(this.responseHandler, this)
          .catch(this.errorHandler.bind(this))
    })
  }

  post<T>(url: string, data: Object, options?: RequestOptionsArgs): Observable<T> {
    const newData = this.prepareData(data);
    
    return this.token().flatMap((token) => {
      this.setHeader('token', token)

        return this.http.post(this.generateUrl(url), newData, this.generateOptions(options))
          .map(this.responseHandler, this)
          .catch(this.errorHandler.bind(this))
      })
  }

  put<T>(url: string, data: Object, options?: RequestOptionsArgs): Observable<T> {
    const newData = this.prepareData(data);
    
    return this.token().flatMap((token) => {
      this.setHeader('token', token)
     
        return this.http.put(this.generateUrl(url), newData, this.generateOptions(options))
          .map(this.responseHandler, this)
          .catch(this.errorHandler.bind(this))
      })
  }

  patch<T>(url: string, data: Object, options?: RequestOptionsArgs): Observable<T> {
    const newData = this.prepareData(data);
    
    return this.token().flatMap((token) => {
      this.setHeader('token', token)
        
        return this.http.put(this.generateUrl(url), newData, this.generateOptions(options))
          .map(this.responseHandler, this)
          .catch(this.errorHandler.bind(this))
      })
  }

  delete<T>(url: string, options?: RequestOptionsArgs): Observable<T> {
    return this.token().flatMap((token) => {
      this.setHeader('token', token)
        
        return this.http.delete(this.generateUrl(url), this.generateOptions(options))
          .map(this.responseHandler, this)
          .catch(this.errorHandler.bind(this))
      })
  }

  protected prepareData(data: any): string {
    
    // Temporarily remove this for backwards compatiblity
    // 
    // return this.requestInterceptors.reduce((acc, interceptor) => interceptor(acc), data);
    return data
  }

  protected responseHandler(resp: Response): any {
    return this.responseInterceptors.reduce((acc: any, interceptor: any) => interceptor(acc), resp)
  }

  protected errorHandler(error: Response): Observable<any> {
    return Observable.throw(
      this.errorInterceptors.reduce((acc: any, interceptor: any) => interceptor(acc), error)
    )
  }

  protected generateUrl(url: string): string {
    return url.match(absoluteURLPattern) ? url : this._endpoint + url
  }

  protected generateOptions(options: RequestOptionsArgs = { }): RequestOptionsArgs {
    if (!options.headers) {
      options.headers = new Headers()
    }

    Object.keys(this.headers)
      .filter((key) => this.headers.hasOwnProperty(key))
      .forEach((key) => {
        options.headers.append(key, this.headers[key]);
      });

    return options
  }
  
  token() {
    return Observable.from(this.storage.get('token'))
  }

  get endpoint(): string {
    return this._endpoint
  }
}