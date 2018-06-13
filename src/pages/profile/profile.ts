import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { User } from '../../models/user';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})

export class ProfilePage {
  user: User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  
  ) {

    this.user = navParams.get('user')
  }

  ionViewDidLoad() {
  }
}