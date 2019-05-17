import { Injectable } from '@angular/core';
import { HTTPService } from '../services/http.service';

import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserProvider {
  constructor(public http: HTTPService) { }

  public load(query?: string) {
    const params: any = query ? { params: { q: query }} : {};

    return this.http.get('users', params);
  }

  public get(id: string, params?: Object) {
    return this.http.get(`users/${ id ? id : '' }`, { params: params })
  }

  public current() {
    return this.get('5cdbeaaecbc67a69d64b19d6')
  }

  public update(id: string, user: User) {
    return this.http.patch(`users/${ id }`, { user: user })
  }

  public likes(id: string) {
    return this.http.get(`users/${ id }/likes`)
  }

  public tags(id: string) {
    return this.http.get(`users/${ id }/tags`)
  }

  public follow(id: string) {
    return this.http.get(`users/${ id }/follow`)
  }

  public unfollow(id: string) {
    return this.http.get(`users/${ id }/unfollow`)
  }
}
