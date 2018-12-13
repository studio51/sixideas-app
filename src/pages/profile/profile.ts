import { Component } from '@angular/core';

import { IonicPage, Events, App, ViewController, ModalController, NavParams } from 'ionic-angular';

import { SessionProvider } from '../../providers/session';

import { User } from '../../models/user';
import { UserProvider } from '../../providers/user';

import { Post } from '../../models/post';
import { PostProvider } from '../../providers/post';

import { SixIdeasApp } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers: [SixIdeasApp]
})

export class ProfilePage {
  user: User;
  posts: Post[] = [];

  currentUser: User;

  constructor(
    private events: Events,
    private appCtrl: App,
    public app: SixIdeasApp,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private params: NavParams,
    private sessionProvider: SessionProvider,
    private userProvider: UserProvider,
    private postProvider: PostProvider
  
  ) { }

  ionViewDidEnter() {
    this.get();
  }

  private async get() {
    const params: Object = {}
    const username: string = this.params.get('username');

    this.currentUser = await this.sessionProvider.user();

    if (username) {
      params['username'] =  username
    }

    if (this.params.get('id') || username) {
      this.user = await this.userProvider.get(this.params.get('id'), params);
    } else {
      this.user = this.currentUser;
    }

    this.posts = await this.postProvider.load(this.user._id.$oid);
  }

  public async edit() {
    const modal = await this.modalCtrl.create('ProfileFormPage');
  
    await modal.present();
    await modal.onDidDismiss((changes: User) => {
      if (changes) {
        this.user = Object.assign(this.user, changes);
      }
    })
  }
  
  public async viewCommunity(want: string, userID: string) {
    const modal = await this.modalCtrl.create('UsersPage', {
      id: userID,
      want: want
    });

    await modal.present();
  }

  public viewLikes(userID: string) {
    this.goToTab('tab:changed', {
      userID: userID,
      want: 'likes'
    });
  }

  public viewPosts(tag: string) {
    this.goToTab('post:tagged', {
      tag: tag,
      want: 'tagged'
    });
  }

  private goToTab(key: string, data: Object, index: number = 0) {
    this.events.publish('tab:changed', data);

    if (this.viewCtrl.isOverlay) {
      this.dismissView();
    }

    this.appCtrl
      .getRootNavs()[0]
      .getActiveChildNavs()[0]
      .select(index);
  }

  public async dismissView() {
    await this.viewCtrl.dismiss();
  }
}