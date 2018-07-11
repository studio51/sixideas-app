import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IonicPage, Events, App, Tabs, ViewController, ModalController, NavParams } from 'ionic-angular';

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

  currentUser: boolean = false;

  tabs: any;

  constructor(
    public events: Events,
    public app: App,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public sessionProvider: SessionProvider,
    public userProvider: UserProvider,
    public postProvider: PostProvider
  
  ) {
    
    this.tabs = this.app.getNavByIdOrName('sixIdeasMainNav') as Tabs;
  }

  ionViewDidEnter() {
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
      this.currentUser = false;
      subscriber = this.userProvider.get(this.navParams.get('id'), params)
    } else {
      this.currentUser = true;
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