import { Component } from '@angular/core';

import { IonicPage, Events, App, Tabs, ViewController, ModalController, NavParams } from 'ionic-angular';

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

  currentUser: boolean = false;

  tabs: any;

  constructor(
    private events: Events,
    platform: App,
    public app: SixIdeasApp,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private sessionProvider: SessionProvider,
    private userProvider: UserProvider,
    private postProvider: PostProvider
  
  ) {
    
    this.tabs = platform.getNavByIdOrName('sixIdeasMainNav') as Tabs;
  }

  ionViewDidEnter() {
    this.getUser()
  }

  private async getUser() {
    // let user: any;
    const params: Object = {};

    if (this.navParams.get('username')) {
      params['params'] = {
        username: this.navParams.get('username')
      }
    }

    if (this.navParams.get('id') || this.navParams.get('username')) {
      this.currentUser = false;
      this.user = await this.userProvider.get(this.navParams.get('id'), params)
    } else {
      this.currentUser = true;
      this.user = await this.sessionProvider.user()
    }

    this.posts = await this.postProvider.load(this.user._id.$oid);
  }

  public editProfile() {
    const profileFormModal = this.modalCtrl.create('ProfileFormPage');
  
    profileFormModal.present();
    profileFormModal.onDidDismiss((userChanges: User) => {
      if (userChanges) {
        this.user = Object.assign(this.user, userChanges)
      }
    })
  }

  public viewFollowing(userID: string) {
    this.events.publish('tab:changed', {
      userID: userID,
      want: 'following'
    });

    this.tabs.select(2);
  }

  public viewFollowers(userID: string) {
    this.events.publish('tab:changed', {
      userID: userID,
      want: 'followers'
    });

    this.tabs.select(2);
  }

  public viewLikes(userID: string) {
    if (this.viewCtrl.component.name === 'ModalCmp') {
      this.dismissView()
    }

    this.events.publish('tab:changed', {
      userID: userID,
      want: 'likes'
    });

    this.tabs.select(1);
  }

  public viewPosts(tag: string) {
    this.events.publish('post:tagged', {
      tag: tag,
      want: 'tagged'
    });

    this.tabs.select(1);
  }

  public dismissView() {
    this.viewCtrl.dismiss()
  }
}