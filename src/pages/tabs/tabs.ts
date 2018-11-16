import { Component } from '@angular/core';
import { IonicPage, Events } from 'ionic-angular';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {
  community     = 'CommunityPage';
  users         = 'UsersPage';
  profile       = 'ProfilePage';
  notifications = 'NotificationsPage';

  newPostsCounter: number = 0;
  newNotificationsCounter: number = 0;

  constructor(events: Events) {
    events.subscribe('post:changed', (counter: number) => {
      this.newPostsCounter = counter;
    });

    events.subscribe('notification:changed', (counter: number) => {
      this.newNotificationsCounter = counter;
    });
  }
}
