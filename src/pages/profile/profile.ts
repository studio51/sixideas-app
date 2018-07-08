import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { IonicPage, App, ViewController, ModalController, NavParams } from 'ionic-angular';

import { SessionProvider } from '../../providers/session';

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
    public app: App,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public sessionProvider: SessionProvider,
    public userProvider: UserProvider,
    public postProvider: PostProvider
  
  ) { }

  ionViewDidLoad() {
    this.getUser()
  }

  private getUser() {
    let subscriber: Observable<User>;
    const params: Object = {};

    if (this.navParams.get('username')) {
      params['params'] = {
        username: this.navParams.get('username')
      }
    }

    if (this.navParams.get('id') || this.navParams.get('username')) {
      subscriber = this.userProvider.get(this.navParams.get('id'), params)
    } else {
      subscriber = this.sessionProvider.user()
    }

    subscriber.subscribe((user: User) => {
      this.user = user;

      this.postProvider.load(user._id.$oid).subscribe((posts: Post[]) => {
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

  public viewFollowing(userID: string) {
    this.app.getRootNav().getActiveChildNav().select(1);
  }

  public viewFollowers(userID: string) {
    this.app.getRootNav().getActiveChildNav().select(1);
  }

  public viewLikes(userID: string) {
    this.app.getRootNav().getActiveChildNav().select(0);
  }

  public dismissView() {
    this.viewCtrl.dismiss()
  }
}