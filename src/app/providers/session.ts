import { Injectable } from '@angular/core';
import { HTTPService } from '../services/http.service';

import { Device } from '@ionic-native/device/ngx';

import { Platform } from '@ionic/angular';

import { User } from '../interfaces/user';
import { UserProvider } from './user';

@Injectable({
  providedIn: 'root'
})
export class SessionProvider {
  constructor(
    public http: HTTPService,
    public platform: Platform,
    public device: Device,
    public userProvider: UserProvider

  ) { }

  public async authenticate(credentials: any) {
    const device: Object = {
      device: { }
    };

    const source: string = await this.platform.ready();

    if (source === 'cordova') {
      // const token: any = await this.notificationService.register();

      device['device'] = {
        platform: this.device.platform,
        model: this.device.model,
        uuid: this.device.uuid,
        // token: token.registrationId,
        // type: token.registrationType
      }
    }

    return this.http.post('sessions/authenticate', Object.assign(credentials, device));
  }

  public current(): Promise<User> {
    return this.userProvider.get('5cdbeaaecbc67a69d64b19d6')
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

export type User = User;