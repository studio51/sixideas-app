import { Component } from '@angular/core';
import { IonicPage, Events } from 'ionic-angular';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {
  community = 'CommunityPage';
  users     = 'UsersPage';
  profile   = 'ProfilePage';

  newPostsCounter: number = 0;

  constructor(events: Events) {

    events.subscribe('post:changed', (counter: number) => {
      this.newPostsCounter = counter
    })
  }
}
