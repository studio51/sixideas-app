import { Component, Input } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { User } from '../../models/user';
import { UserProvider } from '../../providers/user';

@Component({
  selector: 'user',
  templateUrl: 'user.html'
})

export class UserTemplate {
  @Input() user: User;
  @Input() sessionUser: User;

  constructor(
    private modalCtrl: ModalController,
    private userProvider: UserProvider
  
  ) { }

  public async view() {
    const modal = await this.modalCtrl.create('ProfilePage', {
      id: this.user._id.$oid,
      header: false
    });

    await modal.present();
  }

  public async follow() {
    let response: any;

    if (this.following) {
      response = await this.userProvider.unfollow(this.user._id.$oid);
    } else {
      response = await this.userProvider.follow(this.user._id.$oid);
    }

    this.sessionUser = response.user;
  }

  public get currentUser(): boolean {
    return this.sessionUser._id.$oid === this.user._id.$oid;
  }

  public get follower(): boolean {
    return this.sessionUser.follower_ids
      .map((user: User) => user.$oid)
      .includes(this.user._id.$oid);
  }

  public get following(): boolean {
    return this.sessionUser.following_ids
      .map((user: User) => user.$oid)
      .includes(this.user._id.$oid);
  }
}