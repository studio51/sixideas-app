import { Injectable } from '@angular/core';
import { SixIdeasHTTPService } from '../services/http';

@Injectable()
export class FeedProvider {
  constructor(public http: SixIdeasHTTPService) { }

  load() {
    return this.http.get('community')
  }

  get(id: string) {
    return this.http.get(`community/${ id }`)
  }
}
