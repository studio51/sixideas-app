import { Injectable } from '@angular/core';
import { SixIdeasHTTPService } from '../services/http';

import { User } from '../models/user';

@Injectable()
export class UserProvider {
  constructor(public http: SixIdeasHTTPService) { }

  public load() {
    return this.http.get('users')
  }

  public get(id: string) {
    return this.http.get(`users/${ id }`)
  }

  public update(id: string, data: User | { }) {
    return this.http.patch(`users/${ id }`, data)
  }

  public devices(data: { }) {
    console.log(data)
    return this.http.post(`devices`, data)
  }

  public colours() {
    return this.http.get(`users/colours`)
  }

  public interests() {
    return this.http.get(`users/interests`)
  }
}
