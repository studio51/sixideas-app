import { Component, OnInit } from '@angular/core';

import { User } from 'src/app/interfaces/user';
import { Notification } from 'src/app/interfaces/notification';

import { UserProvider } from 'src/app/providers/user';
import { NotificationProvider } from 'src/app/providers/notification';

// 3rd party plugins
//
import * as Sugar from 'sugar';

// Only use what we need as we don't want to load the entire library
//
// TODO: Look into adding this, maybe, into the app module in order to
// make it available everywhere.
//
Sugar.extend({
  namespaces: [Date],
  methods: ['relative', 'format']
})

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss']
})

export class NotificationsPage implements OnInit {

  user: User;
  notifications: Notification[] = [];

  constructor(
    public userProvider: UserProvider,
    public notificationsProvider: NotificationProvider

  ) { }

  async ngOnInit() {
    this.user = await this.userProvider.current();

    this.get();
  }

  public async get() {
    this.notifications = await this.notificationsProvider.load();
  }
  
  public timeAgoInWords(date: string): string {
    // @ts-ignore
    return new Date(date).relative();
  }
}
