import { Component, OnInit } from '@angular/core';

import { AlertController, ModalController } from '@ionic/angular';

import { Notification } from 'src/app/interfaces/notification';
import { User } from 'src/app/interfaces/user';

import { SessionProvider } from 'src/app/providers/session';
import { NotificationProvider } from 'src/app/providers/notification';

import { PostPage } from '../post/post.page';

// 3rd party plugins
//
import * as Sugar from 'sugar';

// Only use what we need as we don't want to load the entire library
//
// TODO: Look into adding this, maybe, into the app module in order to
// make it available everywhere.
//
Sugar.extend({
  namespaces: [String, Date],
  methods: ['truncate', 'relative', 'format']
});

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss']
})

export class NotificationsPage implements OnInit {
  user: User;
  notifications: Notification[] = [];

  constructor(
    public sessionProvider: SessionProvider,
    public notificationsProvider: NotificationProvider,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController

  ) { }

  async ngOnInit() {
    this.user = await this.sessionProvider.current();
    this.get();
  }

  public async get(event?: any) {
    this.notifications = await this.notificationsProvider.load();

    if (event) {
      await event.target.complete();
    }
  }

  public timeAgoInWords(date: string): string {
    // @ts-ignore
    return new Date(date).relative();
  }

  public async confirm() {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'This will remove all of your Notifications!',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary'
      }, {
        text: 'Okay',
        handler: () => {
          this.markAllAsRead();
        }
      }]
    });

    await alert.present();
  }

  public getAndViewObject(event: any, notification: Notification) {
    const object: any = notification.object_with_usernames;
    let postID: string,
        commentID: string = null;

    switch (notification.type) {
      case 'comment':
      case 'comment_like':
        postID    = object.commentable_id.$oid;
        commentID = notification.scope_id.$oid;

        break;
      case 'post':
      case 'post_like':
        postID    = notification.scope_id.$oid;

        break;
    }

    this.viewPost(postID, commentID);
  }

  private async viewPost(id: string, commentID?: string) {
    const modal: any = await this.modalCtrl.create({
      component: PostPage,
      componentProps: {
        id: id,
        commentID: commentID,
        user: this.user
      }
    });

    return await modal.present();
  }

  private async markAllAsRead() {
    await this.notificationsProvider.read();
    this.get();
  }
}
