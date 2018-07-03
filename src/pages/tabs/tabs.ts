import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {
  community = 'CommunityPage';
  users     = 'UsersPage';
  profile   = 'ProfilePage';

  constructor() { }
}
