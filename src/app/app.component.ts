import { Component, ViewChild } from '@angular/core';

import { Nav, Platform, Events, ToastController, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { SessionProvider } from '../providers/session';
import { PostProvider } from '../providers/post';

import { NotificationService } from '../services/notification';

@Component({
  templateUrl: 'app.html'
})

export class SixIdeasApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  currentTimestamp: Date;

  appPages: Page[] = [
    { index: 0, title: 'What we do', component: '', icon: '' },
    { index: 1, title: 'Regions', component: '', icon: '' },
    { index: 2, title: 'Clients', component: '', icon: '' }
  ]

  constructor(
    public platform: Platform,
    public events: Events,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public storage: Storage,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public sessionProvider: SessionProvider,
    public postProvider: PostProvider,
    public notificationService: NotificationService

  ) {

    platform.ready().then((source: string) => {
      if (source === 'cordova') {
        statusBar.styleDefault();
        splashScreen.hide();
        
        notificationService.notify().subscribe((notification: any) => {
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

      this.events.subscribe('app:timer', (timestamp: Date) => {
        this.currentTimestamp = (timestamp ? timestamp : new Date());
      });

      Observable.interval(5000).subscribe(() => {
        this.checkSession();
      })
    })
  }

  private async checkSession() {
    const token: string = await this.storage.get('token');
    
    if (token) {
      // await this.sessionProvider.appear()
      this.rootPage = 'TabsPage';
      // this.subscribeToNewPosts();
    } else {
      this.rootPage = 'AuthenticationPage';
    }
  }

  public async logout() {
    const response: any = await this.sessionProvider.logout()
    
    if (response) {
      await this.storage.remove('token')
      this.rootPage = 'AuthenticationPage'
    }
  }

  private async subscribeToNewPosts() {
    if (this.currentTimestamp) {
      const response = await this.postProvider.check(this.currentTimestamp)
      this.events.publish('post:changed', response.count)
    }
  }

  openPage(page: Page) {
    let params = {};

    // the nav component was found using @ViewChild(Nav)
    // setRoot on the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    // 
    if (page.index) {
      params = {
        tabIndex: page.index
      }
    }

    // If we are already on tabs just change the selected tab
    // don't setRoot again, this maintains the history stack of the
    // tabs even if changing them from the menu
    // 
    if (this.nav.getActiveChildNavs().length && page.index != undefined) {
      this.nav.getActiveChildNavs()[0].select(page.index);
    // Set the root of the nav with params if it's a tab index
    } else {
      this.nav.setRoot(page.title, params).catch((err: any) => {
        console.log(`Didn't set nav root: ${err}`);
      });
    }
    // this.nav.setRoot(page)
  }
}

export interface Page {
  index: number;
  title: string;
  component: any;
  icon: string;
}