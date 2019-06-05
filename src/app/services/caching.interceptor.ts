import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpHeaders, HttpInterceptor } from '@angular/common/http';

import { RequestCacheService } from './request-cache.service';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';

const TTL = 10;

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private cache: RequestCacheService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const cachedResponse = this.cache.get(req.url);
    return cachedResponse ? of(cachedResponse) : this.sendRequest(req, next);
  }

  sendRequest(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cache.set(req.url, event, TTL);
        }
      })
    );
  }
}