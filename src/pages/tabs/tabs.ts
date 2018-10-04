import { Component } from '@angular/core';
import { IonicPage, Events, MenuController } from 'ionic-angular';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {
  community = 'CommunityPage';
  // users     = 'UsersPage';
  // profile   = 'ProfilePage';

  newPostsCounter: number = 0;

  constructor(
    events: Events,
    public menuCtrl: MenuController

  ) {

    events.subscribe('post:changed', (counter: number) => {
      this.newPostsCounter = counter
    })
  }

  public openSideMenu() {
    this.menuCtrl.open()
  }
}
