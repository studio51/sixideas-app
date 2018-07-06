import { Component } from '@angular/core';
import { IonicPage, ModalController, NavParams } from 'ionic-angular';

import { User } from '../../models/user';
import { UserProvider } from '../../providers/user';

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})

export class UsersPage {
  users: User[] = [];
  currentUser: User;

  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public userProvider: UserProvider

  ) { }

  ionViewDidLoad() {
    this.getUsers()
  }

  getUsers() {
    this.userProvider.load().subscribe((users: User[]) => {
      this.users = users
    })
  }

  viewProfile(user: User) {
    const modal = this.modalCtrl.create('ProfilePage', {
      user: user,
      id: user._id.$oid
    });

    modal.present();
  }

  userIsFollowingYou(followers: Array<any>) {
    //  const mappedFollowers: any = followers.map((follower: any) => follower.id);
    // return mappedFollowers.includes(this.currentUser.id)
  }

  userIsFollowingMe(followers: Array<any>) {
    //  const mappedFollowers: any = followers.map((follower: any) => follower.id);
    // return mappedFollowers.includes(this.currentUser.id)
  }
}
