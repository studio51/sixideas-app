import { Injectable } from '@angular/core';
import { SixIdeasHTTPService } from '../services/http';

@Injectable()
export class PostProvider {
  constructor(public http: SixIdeasHTTPService) { }

  load(userID?: string, options: any = {}) {
    const params = [];
    
    if (userID) {
      params['user_id'] = userID
    }

    return this.http.get('posts', { params: Object.assign(params, options) })
  }

  get(id: string) {
    return this.http.get(`posts/${ id }`)
  }
}
