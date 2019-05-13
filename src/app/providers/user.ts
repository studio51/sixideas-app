import { Injectable } from '@angular/core';
import { HTTPService } from '../services/http.service';

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
    return this.get('5bc8bd7796e80d3b97f0e179')
  }

  // public update(id: string, data: User | { }) {
  //   return this.http.patch(`users/${ id }`, data)
  // }

  public follow(id: string) {
    return this.http.get(`users/${ id }/follow`)
  }

  public unfollow(id: string) {
    return this.http.get(`users/${ id }/unfollow`)
  }
}
