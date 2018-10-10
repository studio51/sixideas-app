import { Component } from '@angular/core';
import { IonicPage, ModalController } from 'ionic-angular';

import { User } from '../../models/user';

import { SessionProvider } from '../../providers/session';
import { UserProvider } from '../../providers/user';

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})

export class UsersPage {
  private user: User;

  users: User[] = [];

  constructor(
    public modalCtrl: ModalController,
    public sessionProvider: SessionProvider,
    public userProvider: UserProvider

  ) { }

  ionViewDidEnter() {
    this.getUsers()
  }

  private async getUsers() {
    this.user = await this.sessionProvider.user();
    this.users = await this.userProvider.load();

    console.log(this.users)
  }

  public viewProfile(user: User) {
    const modal = this.modalCtrl.create('ProfilePage', {
      id: user._id.$oid
    });

    modal.present();
  }

  public follow(user: User) {
    let subscriber: any;

    if (this.imFollowing(user)) {
      subscriber = this.userProvider.unfollow(user._id.$oid)
    } else {
      subscriber = this.userProvider.follow(user._id.$oid)
    }

    subscriber.subscribe((response: any) => {
      if (response.status === 'ok') {
        this.user = response.user
      } else {
        console.log('error')
      }
    })
  }

  public itsaMeMario(user: User) {
    return this.user._id.$oid === user._id.$oid
  }

  public isFollowing(user: User) {
    return this.user.follower_ids.map(k => k.$oid).includes(user._id.$oid)
  }

  public imFollowing(user: User) {
    return this.user.following_ids.map(k => k.$oid).includes(user._id.$oid)
  }
}
