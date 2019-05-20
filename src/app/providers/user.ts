import { Injectable } from '@angular/core';
import { HTTPService } from '../services/http.service';

import { User } from '../interfaces/user';
import { Post } from '../interfaces/post';
import { Tag } from '../interfaces/tag';

@Injectable({
  providedIn: 'root'
})
export class UserProvider {
  constructor(public http: HTTPService) { }

  public async load(params?: Object) {
    const response: any = await this.http.get('users', {
      observe: 'response',
      params: params
    });

    return {
      users: response.body,
      total_users: response.headers.get('Total')
    }
  }

  public get(id: string, params?: Object) {
    return this.http.get(`users/${ id ? id : '' }`, { params: params })
  }

  // Resources
  //
  public likes(id: string): Promise<Post[]> {
    return this.http.get(`users/${ id }/likes`)
  }

  public tags(id: string): Promise<Tag[]> {
    return this.http.get(`users/${ id }/tags`)
  }

  public followers(id: string): Promise<User[]> {
    return this.http.get(`users/${ id }/followers`)
  }

  public following(id: string): Promise<User[]> {
    return this.http.get(`users/${ id }/following`)
  }

  // CRUD

  public update(id: string, user: User): Promise<User> {
    return this.http.patch(`users/${ id }`, { user: user })
  }

  // TODO: This should be PUT
  //
  public follow(id: string) {
    return this.http.get(`users/${ id }/follow`)
  }

  public unfollow(id: string) {
    return this.http.get(`users/${ id }/unfollow`)
  }

  // TODO: This should be a store
  public current(): Promise<User> {
    return this.get('5cdbeaaecbc67a69d64b19d6')
  }
}
