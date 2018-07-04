import { Component } from '@angular/core';

import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { NotificationService } from '../services/notification';

@Component({ templateUrl: 'app.html' })

export class SixIdeasApp {
  rootPage: any;

  constructor(
    platform: Platform,
    public storage: Storage,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    notificationService: NotificationService
  
  ) {

    platform.ready().then((source: string) => {
      if (source === 'cordova') {
        statusBar.styleDefault();
        splashScreen.hide();
        notificationService.notify();
      }

      this.checkSession().subscribe();
    })
  }

  private checkSession() {
    return Observable.create((observer) => {
      this.storage.get('token').then((token: string) => {
        this.rootPage = (token ? 'TabsPage' : 'AuthenticationPage');
        observer.complete();
      })
    })
  }
}
