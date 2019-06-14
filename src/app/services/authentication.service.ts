import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device/ngx';

import { ToastController, Platform } from '@ionic/angular';

import { BehaviorSubject } from 'rxjs';

import { SessionProvider } from '../providers/session';

@Injectable()
export class AuthenticationService {
  authState = new BehaviorSubject(false);

  constructor(
    private router: Router,
    private storage: Storage,
    private platform: Platform,
    private device: Device,
    private sessionProvider: SessionProvider,
    public toastController: ToastController

  ) {

    this.isLoggedIn();
  }

  public async isLoggedIn() {
    await this.platform.ready();
    return this.authState.next(await this.storage.get('sixideas-token') ? true : false);
  }

  public async login(data: {}) {
    const response: any = await this.sessionProvider.authenticate(data);

    if (response.success) {
      await this.storage.set('sixideas-token', response.user._id.$oid);

      this.router.navigate(['tabs']);
      this.authState.next(true);
    }
  }

  public async logout() {
    const response: any = await this.sessionProvider.logout();

    await this.storage.remove('sixideas-token');

    this.router.navigate(['authentication']);
    this.authState.next(false);
  }

  public isAuthenticated(): boolean {
    return this.authState.value;
  }
}