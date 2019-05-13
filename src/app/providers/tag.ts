import { Injectable } from '@angular/core';
import { HTTPService } from '../services/http.service';

// import { Post } from '../models/post';
@Injectable({
  providedIn: 'root'
})
export class TagProvider {
  constructor(public http: HTTPService) { }

  public load(query?: string) {
    const params: any = query ? { params: { q: query }} : {};

    return this.http.get('meta/tags', params);
  }
}