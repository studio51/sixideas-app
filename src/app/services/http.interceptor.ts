import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Storage } from '@ionic/storage';

@Injectable()
export class HTTPInterceptor implements HttpInterceptor {
  constructor(private storage: Storage) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.storage.get('sixideas-token')).pipe(
      mergeMap((token: string) => {
        if (token) {
          request = request.clone({
            setHeaders: {
              token: token
            }
          });
        } else {
          request = request.clone({
            setHeaders: {
              token: "5cdbeaaecbc67a69d64b19d6"
            }
          });
        }

        return next.handle(request);
      })
    );
  }
}
