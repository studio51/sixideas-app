import { Component } from '@angular/core';
import { IonicPage, Events, ModalController } from 'ionic-angular';

import { User } from '../../models/user';

import { SessionProvider } from '../../providers/session';
import { UserProvider } from '../../providers/user';

import { SixIdeasApp } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
  providers: [SixIdeasApp]
})

export class UsersPage {
  private user: User;

  users: User[] = [];
  params: any;

  constructor(
    public app: SixIdeasApp,
    private events: Events,
    private modalCtrl: ModalController,
    private sessionProvider: SessionProvider,
    private userProvider: UserProvider

  ) { }

  ionViewDidEnter() {
    this.get();
  }

  ionViewWillEnter() {
    this.events.subscribe('tab:changed', (data: any) => {
      this.params = data;
      this.get();
    });
  }

  ionViewDidLeave() {
    this.events.unsubscribe('tab:changed');
  }

  private async get() {
    this.user = await this.sessionProvider.user();
    const users: User[] = await this.userProvider.load();

    if (this.params) {

      // Clear the current Users list
      // 
      this.users = []

      // Find the Users that match the passed User IDs'
      // TODO: This seems really inefficient.
      // 
      this.params['users']
        .map((u: any) => u['$oid'])
        .forEach((userID: string) => {
          this.users.push(users.filter((user: User) => user._id.$oid === userID)[0]);
        });
    } else {
      this.users = users;
    }
  }

  public async view(user: User) {
    const modal = await this.modalCtrl.create('ProfilePage', {
      id: user._id.$oid,
      header: false
    });

    await modal.present();
  }

  public async follow(user: User) {
    let response: any;

    if (this.imFollowing(user)) {
      response = await this.userProvider.unfollow(user._id.$oid)
    } else {
      response = await this.userProvider.follow(user._id.$oid)
    }

    this.user = response.user;
  }

  public currentUser(user: User) {
    return this.user._id.$oid === user._id.$oid
  }

  public isFollowing(user: User) {
    return this.user.follower_ids
      .map((u: any) => u.$oid)
      .includes(user._id.$oid)
  }

  public imFollowing(user: User) {
    return this.user.following_ids
      .map((u: any) => u.$oid)
      .includes(user._id.$oid)
  }
}