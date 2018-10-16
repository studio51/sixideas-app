import * as SixIdeasConfig from '../app/app.config';

import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Ng2Cable } from 'ng2-cable';

import { Platform, App, Events, MenuController, ToastController, ModalController } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { User } from '../models/user';

import { SessionProvider } from '../providers/session';

import { NotificationService } from '../services/notification';

@Component({
  templateUrl: 'app.html'
})

export class SixIdeasApp {
  rootPage: any;
  currentTimestamp: Date;
  
  token: string = null;
  user: User;

  appPages: Page[] = [
    { index: 0, title: 'News Feed', target: 'feed', icon: 'newspaper'},
    { index: 1, title: 'Trending', target: 'tags', icon: 'list' },
    { index: 2, title: 'Likes', target: 'likes', icon: 'heart' },
  ]
  staticPages: Page[] = [
    { index: 0, title: 'What we do', target: `${ SixIdeasConfig.webURL }` },
    { index: 1, title: 'Regions', target: `${ SixIdeasConfig.webURL }#region` },
    { index: 2, title: 'Clients', target: `${ SixIdeasConfig.webURL }` },
  ]

  constructor(
    private cable: Ng2Cable,
    platform: Platform,
    private appCtrl: App,
    private events: Events,
    private menuCtrl: MenuController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private storage: Storage,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private sessionProvider: SessionProvider,
    private notificationService: NotificationService

  ) {

    platform.ready().then((source: string) => {
      if (source === 'cordova') {
        platform.resume.subscribe(() => { this.sessionProvider.appear(); });
        platform.pause.subscribe(() => { this.sessionProvider.away(); })

        statusBar.styleDefault();
        splashScreen.hide();
      }

      this.prepareApp();
    })
  }
  
  public async openSideMenu() {
    await this.menuCtrl.open();
  }

  public chnageFeed(feed: string) {
    this.events.publish('post:tagged', {
      tag: null,
      want: feed
    });

    this.updateView();
  }

  public setTag(tag: string) {
    this.events.publish('post:tagged', {
      tag: tag,
      want: 'tagged'
    });

    this.updateView();
  }

  private async updateView() {
    const index: number = 0;

    await this.menuCtrl.close();
    await this.appCtrl
      .getRootNavs()[index]
      .getActiveChildNavs()[index]
      .select(index);
  }

  private async prepareApp() {
    await this.checkLoginStatus();
    await this.checkSession();
    await this.cableify();
  }

  private async checkSession() {
    if (this.token) {
      this.events.subscribe('app:timer', (timestamp: Date) => {
        this.currentTimestamp = (timestamp ? timestamp : new Date());
      });

      // this.registerNotifications();

      Observable.timer(5000).subscribe(() => {
        // this.checkForNewPosts();
      })

      return true;
    }

    return false;
  }

  private async checkLoginStatus() {
    this.token = await this.storage.get('token');
    this.user = await this.sessionProvider.user();

    if (this.token) {
      this.rootPage = 'TabsPage';
    } else {
      this.rootPage = 'AuthenticationPage'
    }
  }

  private cableify() {
    const url: string = `${ SixIdeasConfig.url }cable?token=${ this.token }`;
    
    this.cable.subscribe(url, 'AppearanceChannel', { room: 'appearances' });
    // this.cable.subscribe(url, 'PostChannel', { room: 'posts' });
  }

  public async logout() {
    const response: any = await this.sessionProvider.logout()
    
    if (response.success) {
      await this.storage.remove('token');

      this.rootPage = 'AuthenticationPage'
    } else {
      // TODO: Return feedback
    }
  }

  // private async checkForNewPosts() {
  //   if (this.currentTimestamp) {
  //     const response = await this.postProvider.check(this.currentTimestamp)
  //     this.events.publish('post:changed', response.count)
  //   }
  // }

  private registerNotifications() {
    this.notificationService.notify().subscribe((notification: any) => {
      const toast = this.toastCtrl.create({
        message: notification.message,
        duration: 3000,
        showCloseButton: true,
        closeButtonText: 'View',
        position: 'top'
      });

      toast.onDidDismiss((data: any, role: string) => {
        if (role == 'close') {
          const modal: any = this.modalCtrl.create('PostPage', {
            id: notification.additionalData.post_id
          });

          modal.present();
        }
      });

      toast.present();
    })
  }
}

export interface Page {
  index: number;
  title: string;
  target?: string;
  icon?: string;
}