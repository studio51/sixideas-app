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

  private getUsers() {
    this.sessionProvider.user().subscribe((user: User) => {
      this.user = user;
      
      this.userProvider.load().subscribe((users: User[]) => {
        this.users = users
      });
    })
  }

  public viewProfile(user: User) {
    const modal = this.modalCtrl.create('ProfilePage', {
      id: user._id.$oid
    });

    modal.present();
  }

  public isFollowing(user: User) {
    return this.user.follower_ids.map(k => k.$oid).includes(user._id.$oid)
  }

  public imFollowing(user: User) {
    return this.user.following_ids.map(k => k.$oid).includes(user._id.$oid)
  }
}
