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

  users: User[];
  qUsers: User[] = [];

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

  public searchUsers(event: any) {
    this.users = this.qUsers;

    const value: string = event.target.value;

    if (value && value.trim() != '') {
      this.users = this.users.filter((user: User) => {
        return (
          this.filter(user.email, value),
          this.filter(user.username, value),
          this.filter(user.name, value)
        );
      });
    }
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
          const u = users.filter((user: User) => user._id.$oid === userID)[0];

          this.users.push(u);
          this.qUsers.push(u);
        });
    } else {
      this.users = this.qUsers = users;
    }
  }

  public async view(user: User) {
    const modal = await this.modalCtrl.create('ProfilePage', {
      id: user._id.$oid,
      header: false
    });

    await modal.present();
  }

  public currentUser(user: User) {
    return this.user._id.$oid === user._id.$oid;
  }

  public async follow(user: User) {
    let response: any;

    if (this.following(user)) {
      response = await this.userProvider.unfollow(user._id.$oid);
    } else {
      response = await this.userProvider.follow(user._id.$oid);
    }

    this.user = response.user;
  }

  public follower(user: User) {
    return this.user.follower_ids
      .map((user: User) => user.$oid)
      .includes(user._id.$oid);
  }

  public following(user: User) {
    return this.user.following_ids
      .map((user: User) => user.$oid)
      .includes(user._id.$oid);
  }

  private filter(query: string, value: string) {
    return query.toLowerCase().indexOf(value.toLowerCase()) > -1;
  }
}