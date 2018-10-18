import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { Device } from '@ionic-native/device';

import { SixIdeasHTTPService } from '../services/http';
import { NotificationService } from '../services/notification';

import { User } from '../models/user';

@Injectable()
export class UserProvider {
  constructor(
    public platform: Platform,
    public device: Device,
    public http: SixIdeasHTTPService,
    public notificationService: NotificationService
  
  ) { }

  public load(query?: string) {
    const params: any = query ? { params: { q: query }} : {};

    return this.http.get('users', params);
  }

  public get(id: string, params?: Object) {
    return this.http.get(`users/${ id ? id : '' }`, params)
  }

  public update(id: string, data: User | { }) {
    return this.http.patch(`users/${ id }`, data)
  }

  public follow(id: string) {
    return this.http.get(`users/${ id }/follow`)
  }

  public unfollow(id: string) {
    return this.http.get(`users/${ id }/unfollow`)
  }
}
