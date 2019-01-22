import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { Device } from '@ionic-native/device';

import { SixIdeasHTTPService } from '../services/http';
import { NotificationService } from '../services/notification';

@Injectable()
export class SessionProvider {
  constructor(
    public platform: Platform,
    public device: Device,
    public http: SixIdeasHTTPService,
    public notificationService: NotificationService
  
  ) { }

  public async authenticate(credentials?: Object) {
    const device: Object = {
      device: { }
    };
    
    const source: string = await this.platform.ready();
    
    if (source === 'cordova') {
      const token: any = await this.notificationService.register();

      device['device'] = {
        platform: this.device.platform,
        model: this.device.model,
        uuid: this.device.uuid,
        token: token.registrationId,
        type: token.registrationType
      }
    }

    return this.http.post('sessions/authenticate', Object.assign(credentials, device));
  }

  public user() {
    return this.http.get('sessions/user').then((response: any) => response.success ? response.user : response);
  }

  public logout() {
    return this.http.delete('sessions/logout', {});
  }

  public appear() {
    return this.http.post('sessions/appear', {});
  }

  public away() {
    return this.http.post('sessions/away', {});
  }
}