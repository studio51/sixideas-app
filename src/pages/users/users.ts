import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
    public navCtrl: NavController,
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

  viewUserProfile(user: User) {
    this.navCtrl.push('ProfilePage', {
      user: user,
      id: user.uuid
    })
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
