import { Injectable } from '@angular/core';
import { SixIdeasHTTPService } from '../services/http';

@Injectable()
export class TagProvider {
  constructor(public http: SixIdeasHTTPService) { }

  public load() {
    return this.http.get(`meta/tags`)
  }
}
