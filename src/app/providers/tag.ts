import { Injectable } from '@angular/core';
import { HTTPService } from '../services/http.service';

import { Tag } from '../interfaces/tag';

@Injectable({
  providedIn: 'root'
})
export class TagProvider {
  constructor(public http: HTTPService) { }

  public load(params?: Object): Promise<Tag[]> {
    return this.http.get('meta/tags', { params: params });
  }
}