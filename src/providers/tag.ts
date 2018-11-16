import { Injectable } from '@angular/core';
import { SixIdeasHTTPService } from '../services/http';

@Injectable()
export class TagProvider {
  constructor(
    public http: SixIdeasHTTPService
  
  ) { }

  public load(query?: string) {
    const params: any = query ? { params: { q: query }} : {};

    return this.http.get('meta/tags', params);
  }
}
