import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { Device } from '@ionic-native/device';

import { SixIdeasHTTPService } from '../services/http';
import { NotificationService } from '../services/notification';

import { User } from '../models/user';

@Injectable()
export class SessionProvider {
  constructor(
    public platform: Platform,
    public device: Device,
    public http: SixIdeasHTTPService,
    public notificationService: NotificationService
  
  ) { }

  public authenticate(credentials?: Object) {
    const device: Object = {};
          device['device'] = {}
    
    if (this.platform.is('cordova')) {
      device['device'] = {
        platform: this.device.platform,
        model: this.device.model,
        uuid: this.device.uuid
      }
    }
    
    return this.notificationService.register().flatMap((token: any) => {
      if (this.platform.is('cordova')) {
        device['device']['token'] = token.registrationId;
        device['device']['type'] = token.registrationType;

        console.log(JSON.stringify(Object.assign(credentials, device)));
      }

      return this.http.post('sessions/authenticate', Object.assign(credentials, device))
    })
  }

  public user() {
    return this.http.get('sessions/user').then((response: any) => response.success ? response.user : response)
  }

  public logout() {
    // return this.http.delete('sessions/logout', {})
  }

  public appear() {
    return this.http.post('sessions/appear', {})
  }

  public away() {
    return this.http.post('sessions/away', {})
  }

  private dissapear() {
    return this.http.post('sessions/disappear', {})
  }
}