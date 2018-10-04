import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Storage } from '@ionic/storage';

@Injectable()
export class HTTPInterceptor implements HttpInterceptor {
  constructor(private storage: Storage) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return Observable.from(this.storage.get('token'))
      .flatMap((token: string) => {
        if (token) {
          request = request.clone({
            setHeaders: {
              token: token
            }
          });
        }

        return next.handle(request);
      });
  }
}
