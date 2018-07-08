import { Component } from '@angular/core';

import { Platform, Events } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { NotificationService } from '../services/notification';

import { SessionProvider } from '../providers/session';
import { PostProvider } from '../providers/post';

@Component({ templateUrl: 'app.html' })

export class SixIdeasApp {
  rootPage: any;
  currentTimestamp: Date;

  constructor(
    public platform: Platform,
    public events: Events,
    public storage: Storage,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    notificationService: NotificationService,
    public sessionProvider: SessionProvider,
    public postProvider: PostProvider
  
  ) {

    platform.ready().then((source: string) => {
      if (source === 'cordova') {
        statusBar.styleDefault();
        splashScreen.hide();
        notificationService.notify();
      }

      this.checkSession().subscribe();
      this.subscribeToNewPosts();
    })

    platform.pause.subscribe((res) => {
      console.log('pause', res)
    })

    platform.resume.subscribe((res) => {
      console.log('back', res)
    })
  }

  private checkSession() {
    return Observable.create((observer) => {
      this.storage.get('token').then((token: string) => {
        this.sessionProvider.appear().subscribe(() => {
          this.events.subscribe('app:timer', (timestamp: Date) => {
            this.currentTimestamp = (timestamp ? timestamp : new Date());
          });

          this.rootPage = (token ? 'TabsPage' : 'AuthenticationPage');
          observer.complete();
        })
      })
    })
  }

  private subscribeToNewPosts() {
    Observable.interval(2500).subscribe(() => {
      this.postProvider.check(this.currentTimestamp).subscribe((response: any) => {
        this.events.publish('post:changed', response.count)
      })
    })
  }
}
