import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';

import { SessionProvider, User } from './providers/session';
import { CableProvider } from 'src/app/providers/cable';
import { AppereanceService } from './services/appearance.service';
import { NotificationService } from './services/notification.service';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent {
  user: User;

  constructor(
    private platform: Platform,
    public toastCtrl: ToastController,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public storage: Storage,
    private sessionProvider: SessionProvider,
    private cableProvider: CableProvider,
    private appereanceService: AppereanceService,
    public notificationService: NotificationService,
    public authenticationService: AuthenticationService

  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    console.log('started app');

    this.statusBar.styleDefault();
    this.splashScreen.hide();

    this.router.navigate(['tabs']);
    this.authenticationService.authState.subscribe(async (state: boolean) => {
      if (state) {
        this.router.navigate(['tabs']);

        this.user = await this.sessionProvider.current();

        this.subscribeToAppearances();
        this.subscribeToNewPosts();
        this.subscribeToNotifications();
      } else {
        this.router.navigate(['authentication']);
      }
    });
  }

  private async subscribeToAppearances() {
    this.cableProvider.appearances().subscribe((appearances: any) => {
      Object.keys(appearances).forEach((uuid: string) => {
        this.appereanceService.change.next({
          uuid: uuid,
          state: appearances[uuid]
        });
      });
    });
  }

  private async subscribeToNewPosts() {
    const known_posts_count: number = await this.storage.get('posts_counter');

    this.cableProvider.posts().subscribe((counter: number) => {
      console.log(known_posts_count);
      console.log(counter);
    });
  }

  private async toast(message) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000
    });

    toast.present();
  }

  private subscribeToNotifications() {
    this.notificationService.get();
    this.notificationService.onNotifications().subscribe((msg) => {
      console.log('started subscription');  

      if (this.platform.is('ios')) {
        this.toast(msg.aps.alert);
      } else {
        this.toast(msg.body);
      }
      console.log('started subscription', JSON.parse(msg));  

    });
  }
}
