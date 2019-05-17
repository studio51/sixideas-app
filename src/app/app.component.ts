import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { User } from './interfaces/user';

import { UserProvider } from './providers/user';
import { CableProvider } from 'src/app/providers/cable';
import { AppereanceService } from './services/appearance.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent {
  user: User;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public userProvider: UserProvider,
    public cableProvider: CableProvider,
    private appereanceService: AppereanceService

  ) {

    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();

    this.user = await this.userProvider.current();

    this.statusBar.styleDefault();
    this.splashScreen.hide();

    this.subscribeToAppearances();
    this.subscribeToNewPosts();
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
    this.cableProvider.posts().subscribe((counter: any) => {
      console.log(counter)
    });
  }
}
