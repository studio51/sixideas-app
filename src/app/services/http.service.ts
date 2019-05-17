import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHeaderResponse } from '@angular/common/http';

import { throwError, of, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

type ResponseInterceptor = (response: any) => any;
type RequestInterceptor = (request: any) => any;
type ErrorInterceptor = (error: any) => any;

const absoluteURLPattern = /^((?:https:\/\/)|(?:http:\/\/)|(?:www))/;

// enum endpoints {
//   production  = 'https://1801-six-ideas.mdw.re',
//   development = 'http://192.168.0.11:3000'
// }

// const environment: string = 'development';

// export const webURL: string = `${ endpoints[environment] }`;
// export const url: string = `${ webURL }/api/v1/`;

@Injectable({
  providedIn: 'root'
})

export class HTTPService {
  headers: any = '';

  private responseInterceptors: Array<ResponseInterceptor> = [];
  private requestInterceptors: Array<RequestInterceptor> = [];
  private errorInterceptors: Array<ErrorInterceptor> = [];

  constructor(
    public http: HttpClient

  ) { }

  public get url(): string {
    return 'http://192.168.0.11:3000/api/v1/';
  }

  public get<T>(url: string, options?: {}): Promise<any> {
    return this.http
      .get<T>(this.generateURL(url), this.generateOptions(options))
      .pipe(
        map(this.responseHandler, this),
        catchError(this.errorHandler.bind(this))
      )
      .toPromise();
  }

  public post<T>(url: string, data: Object, options?: {}): Promise<any> {
    return this.http
      .post<T>(this.generateURL(url), this.prepareData(data), this.generateOptions(options))
      .pipe(
        map(this.responseHandler, this),
        catchError(this.errorHandler.bind(this))
      )
      .toPromise();
  }

  // put<T>(url: string, data: Object, options?: {}): Observable<T> {
  //   const newData = this.prepareData(data);

  //   // return Observable.from(this.storage.get('token')).flatMap((token) => {
  //     // this.setHeader('token', token)

  //     return this.http.put(this.generateUrl(url), newData, this.generateOptions(options))
  //       .pipe(map(this.responseHandler, this), catchError(this.errorHandler.bind(this)));
  //     // })
  // }

  public patch<T>(url: string, data: Object, options?: {}): Promise<any> {
    return this.http
      .put<T>(this.generateURL(url), this.prepareData(data), this.generateOptions(options))
      .pipe(
        map(this.responseHandler, this),
        catchError(this.errorHandler.bind(this))
      )
      .toPromise();
    }

  // delete<T>(url: string, options?: {}): Observable<T> {
  //   // return Observable.from(this.storage.get('token')).flatMap((token) => {
  //     // this.setHeader('token', token)

  //     return this.http.delete(this.generateUrl(url), this.generateOptions(options))
  //       .pipe(map(this.responseHandler, this), catchError(this.errorHandler.bind(this)));
  //     // })
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
    return url.match(absoluteURLPattern) ? url : this.url + url
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
