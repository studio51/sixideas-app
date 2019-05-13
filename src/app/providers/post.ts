import { Injectable } from '@angular/core';
import { HTTPService } from '../services/http.service';

import { Post } from '../interfaces/post';

@Injectable({
  providedIn: 'root'
})
export class PostProvider {
  constructor(public http: HTTPService) { }

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

  // public preview(url: string) {
  //   return this.http.get(`posts/preview`, { params: { url: url }});
  // }

  public create(post: Post) {
    return this.http.post('posts', post)
  }

  public update(id: string, data: Post | { }) {
    return this.http.patch(`posts/${ id }`, data)
  }

  // public check(timestamp: Date) {
  //   return this.http.get('posts/count.json', { params: { date: timestamp }})
  // }
}
