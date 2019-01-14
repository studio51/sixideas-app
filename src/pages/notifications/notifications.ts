import { Component } from '@angular/core';
import { IonicPage, ViewController, ModalController } from 'ionic-angular';

import { User } from '../../models/user';
import { SessionProvider } from '../../providers/session';

import { Notification } from '../../models/notification';
import { NotificationProvider } from '../../providers/notification';

import { SixIdeasApp } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
  providers: [SixIdeasApp]
})

export class NotificationsPage {
  user: User;
  notifications: Notification[];

  showLoadingIndicator: boolean = false;

  constructor(
    public viewCtrl: ViewController, 
    private modalCtrl: ModalController,
    private sessionProvider: SessionProvider,
    private notificationProvider: NotificationProvider
  
  ) { }

  async ionViewDidEnter() {
    this.user = await this.sessionProvider.user();
    this.get();
  }

  public refresh(refresher?: any) {
    this.showLoadingIndicator = true;
    this.get();
    this.showLoadingIndicator = false;
    refresher.complete();
  }

  private async get() {
    this.notifications = await this.notificationProvider.load();
  }

  public async markAllRead() {
    await this.notificationProvider.markAllRead();
    this.notifications = [];
  }

  public goTo(event: any, notification: Notification) {
    const node: any = event.target;

    if (node.nodeName === 'A') {
      this.viewProfile(notification);
    } else {
      this.viewPost(notification);
    }
  }

  private async viewProfile(notification: Notification) {
    const modal = await this.modalCtrl.create('ProfilePage', {
      id: notification.trigger_id.$oid,
      header: false
    });

    await modal.present();
  }

  private async viewPost(notification: Notification) {
    const modal = await this.modalCtrl.create('PostPage', {
      id: notification.scope_id.$oid,
      scope: notification.scope
    });

    await modal.present();
  }

  public imMentioned(notification: Notification): boolean {
    return notification.object_with_usernames.usernames.includes(this.user.username)
  }

  public myPost(notification: Notification): boolean {
    return notification.object_with_usernames.commentable.user_id.$oid === this.user._id.$oid
  }

  public timeAgoInWords(date: any): string {
    const now: any = new Date();
    const parsedDate: any = new Date(date);

    const times: Array<[string, number]> = [
      ['second', 1],
      ['minute', 60],
      ['hour', 3600],
      ['day', 86400],
      ['week', 604800],
      ['month', 2592000],
      ['year', 31536000]
    ];
    
    let difference: number = Math.round((now - parsedDate) / 1000);

    for (let t = 0; t < times.length; t++) {
      if (difference < times[t][1]) {
        if (t === 0) {
          return 'Just now';
        } else {
          difference = Math.round(difference / times[t - 1][1]);
          return `${ difference } ${ times[t - 1][0] }${ (difference === 1 ? ' ago' : 's ago') }`;
        }
      }
    }
  }
}
