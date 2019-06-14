import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { SessionProvider, User } from './providers/session';
import { CableProvider } from 'src/app/providers/cable';
import { AppereanceService } from './services/appearance.service';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent {
  user: User;

  constructor(
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private sessionProvider: SessionProvider,
    private cableProvider: CableProvider,
    private appereanceService: AppereanceService,
    public authenticationService: AuthenticationService

  ) {

    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();

    this.statusBar.styleDefault();
    this.splashScreen.hide();

    this.authenticationService.authState.subscribe(async (state: boolean) => {
      if (state) {
        this.router.navigate(['tabs']);

        this.user = await this.sessionProvider.current();

        this.subscribeToAppearances();
        this.subscribeToNewPosts();
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
    this.cableProvider.posts().subscribe((counter: any) => {
      console.log(counter)
    });
  }
}
