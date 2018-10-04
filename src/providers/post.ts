import { Injectable } from '@angular/core';
import { SixIdeasHTTPService } from '../services/http';

import { Post } from '../models/post';

@Injectable()
export class PostProvider {
  constructor(public http: SixIdeasHTTPService) { }

  public load(userID?: string, options: any = {}) {
    const params = [];
    
    if (userID) {
      params['user_id'] = userID
    }

    return this.http.get('posts', { params: Object.assign(params, options) })
  }

  public get(id: string, options: any = {}) {
    return this.http.get(`posts/${ id }`, { params: options })
  }

  public create(post: Post) {
    return this.http.post('posts', post)
  }

  public update(id: string, data: Post | { }) {
    // return this.http.patch(`posts/${ id }`, data)
  }

  public check(timestamp: Date) {
    return this.http.get('posts/count.json', { params: { date: timestamp }})
  }
}
