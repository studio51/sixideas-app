import * as SixIdeasConfig from '../app/app.config';

import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Ng2Cable } from 'ng2-cable';

import { Platform, App, Events, MenuController, ToastController, ModalController } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser';

import { User } from '../models/user';

import { SessionProvider } from '../providers/session';
import { PostProvider } from '../providers/post';

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
  tag: string = null;

  constructor(
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private storage: Storage,
    private iab: InAppBrowser,
    private cable: Ng2Cable,
    platform: Platform,
    private appCtrl: App,
    private events: Events,
    private menuCtrl: MenuController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private sessionProvider: SessionProvider,
    private postProvider: PostProvider,
    private notificationService: NotificationService

  ) {

    platform.ready().then((source: string) => {
      if (source === 'cordova') {
        if (this.user) {
          platform.resume.subscribe(() => { this.sessionProvider.appear(); });
          platform.pause.subscribe(() => { this.sessionProvider.away(); })
        }

        statusBar.styleLightContent();
        splashScreen.hide();
      }

      this.prepareApp();

      this.events.subscribe('user:changed', (user: User) => {
        this.user = user;
      });
    })
  }
  
  public async openSideMenu() {
    await this.menuCtrl.open();
  }
  
  public async showTags() {
    const tagsModal = await this.modalCtrl.create('TagsPage', {
      // tag: this.tag
    });
  
    await tagsModal.present();
    await tagsModal.onDidDismiss(async (tag: string) => {
      this.setTag(tag);
    });
  }

  public changeFeed(feed: string) {
    this.events.publish('feed:changed', feed);
    this.updateView();
  }

  public setTag(tag: string) {
    this.events.publish('post:tagged', tag);
    this.updateView();
  }

  private async updateView(index: number = 0) {
    await this.appCtrl
      .getRootNavs()[0]
      .getActiveChildNavs()[0]
      .select(index);

    if (this.menuCtrl) {
      await this.menuCtrl.close();
    }
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

      this.registerNotifications();
      Observable.timer(5000).subscribe(() => { this.checkForNewPosts() });

      return true;
    }

    return false;
  }

  private async checkLoginStatus() {
    this.token = await this.storage.get('token');

    if (this.token) {
      this.user = await this.sessionProvider.user();
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

  private async checkForNewPosts() {
    if (this.currentTimestamp) {
      const response = await this.postProvider.check(this.currentTimestamp);
      this.events.publish('post:changed', response.count);
    }
  }

  private async registerNotifications() {
    const notification: any = await this.notificationService.notify();
    const toast: any = await this.toastCtrl.create({
      message: notification.message,
      duration: 3000,
      showCloseButton: true,
      closeButtonText: 'View',
      position: 'top'
    });

    await toast.onDidDismiss((data: any, role: string) => {
      if (role == 'close') {
        const modal: any = this.modalCtrl.create('PostPage', {
          id: notification.additionalData.post_id
        });

        modal.present();
      }
    });

    await toast.present();
  }

  public async openIAB(url: string) {
    await this.iab.create(url, '_system');
  }
}

export interface Page {
  index: number;
  title: string;
  target?: string;
  icon?: string;
}