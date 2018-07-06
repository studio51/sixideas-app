import { Component } from '@angular/core';

import { IonicPage, ViewController, ModalController, NavParams } from 'ionic-angular';

import { User } from '../../models/user';
import { UserProvider } from '../../providers/user';

import { Post } from '../../models/post';
import { PostProvider } from '../../providers/post';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})

export class ProfilePage {
  user: User;
  posts: Post[] = [];

  constructor(
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public postProvider: PostProvider
  
  ) { }

  ionViewDidLoad() {
    this.getUser()
  }

  private getUser() {
    const options: Object = {}

    if (this.navParams.get('username')) {
      options['params'] = {
        username: this.navParams.get('username')
      }
    }

    this.userProvider.get(this.navParams.get('id'), options).subscribe((user: User) => {
      this.user = user;

      this.postProvider.load(user.id).subscribe((posts: Post[]) => {
        this.posts = posts
      });
    })
  }

  public editProfile() {
    const profileFormModal = this.modalCtrl.create('ProfileFormPage', {
      user: this.user,
      id: this.user._id.$oid
    });
  
    profileFormModal.present();
    profileFormModal.onDidDismiss((userChanges: User) => {
      if (userChanges) {
        this.user = Object.assign(this.user, userChanges)
      }
    })
  }

  public dismissView() {
    this.viewCtrl.dismiss()
  }
}