import { Component } from '@angular/core';
import { IonicPage, Events, NavParams, ModalController } from 'ionic-angular';

import { User } from '../../models/user';
import { Post } from '../../models/post';

import { SessionProvider } from '../../providers/session';
import { PostProvider } from '../../providers/post';

import { SixIdeasApp } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-community',
  templateUrl: 'community.html',
  providers: [SixIdeasApp]
})

export class CommunityPage {
  user: User;
  posts: Post[] = [];

  refresher: any;
  showLoadingIndicator: boolean = true;

  feed: string = 'community';

  tag: string = null;
  tags: any[] = [];
  tagSelectionOptions: any = {
    title: 'Tags',
    subTitle: 'Select a Tag to show the posts for'
  }

  reloadOnEnter: boolean = true;
  newPostsCounter: number = 0;
  currentUser: boolean = true;

  constructor(
    private events: Events,
    navParams: NavParams,
    private modalCtrl: ModalController,
    private sessionProvider: SessionProvider,
    private postProvider: PostProvider,
    public app: SixIdeasApp
  
  ) {

    if (navParams.get('tag')) {
      this.setTag(navParams.get('tag'));
    }

    // this.subscribeToTabChangedEvents();
    // this.subscribeToPostChangedEvents();
    this.subscribeToPostTaggedEvents();
    this.subscribeToFeedChangedEvents();
  }

  async ionViewDidEnter() {
    if (this.reloadOnEnter) {
      const user = await this.sessionProvider.user()
      
      this.user = user;
      this.tags = user.interests;

      this.getPosts();
    }
  }

  private getTaggedPosts(tag: string, feed?: string) {
    if (this.feed != 'community') {
      this.feed = feed || 'community';
    }

    this.setTag(tag);
    this.getPosts();
  }

  public refresh(refresher?: any) {
    if (refresher) {
      this.refresher = refresher;
    } else {
      this.showLoadingIndicator = true;
    }

    this.getPosts('', '', false);
    this.reloadOnEnter = true;
  }

  // public feedChanged(event: any) {
  //   this.showLoadingIndicator = true;
    
  //   this.setTag(null);
  //   this.getPosts(event.value);
  // }

  private async getPosts(feed?: string, userID?: any, showLoadingIndicator: boolean = true) {
    this.showLoadingIndicator = showLoadingIndicator;

    const params = {}
          params['include_author'] = true;
    
    if (this.tag) { params['q'] = this.tag }
    if (feed && feed != 'community') {
      this.feed = feed;
      params['feed'] = this.feed;
    } else {
      this.feed = 'feed';
    }

    const user: any = userID ? userID : '';

    this.posts = await this.postProvider.load(user, params);  
    this.showLoadingIndicator = false;

    if (this.refresher) {
      this.refresher.complete();
    }

    this.resetTimer();
  }

  public newPost() {
    const postFormModal = this.modalCtrl.create('PostFormPage');
  
    postFormModal.present();
    postFormModal.onDidDismiss((post: Post) => {
      if (post) {
        this.posts.unshift(post)
      }
    })
  }

  // private subscribeToTabChangedEvents() {
  //   this.events.subscribe('post:changed', (data: any) => {
  //     if (data) {
  //       switch(data.want) {
  //         case 'tagged':
  //           this.tag = data['tag'];
  //           break;
  //         case 'likes':
  //           this.feed = 'likes';
  //           break;
  //       }
  //     }
  //   })
  // }

  // private subscribeToPostChangedEvents() {
  //   this.events.subscribe('post:changed', (counter: number) => {
  //     this.newPostsCounter = counter;
  //   })
  // }
  
  private subscribeToPostTaggedEvents() {
    this.events.subscribe('post:tagged', (tag: any) => {
      this.reloadOnEnter = false;

      if (typeof feed == 'object') {
        this.getTaggedPosts(tag['want'], tag['tag']);
      } else {
        this.getTaggedPosts(tag);
      }
    });
  }
  
  private subscribeToFeedChangedEvents() {
    this.events.subscribe('feed:changed', (feed: any) => {
      this.reloadOnEnter = false;

      if (typeof feed == 'object') {
        this.getPosts(feed['want'], feed['userID']);
      } else {
        this.getPosts(feed);
      }
    });
  }

  private setTag(tag: string) { this.tag = tag }

  private resetTimer() {
    this.events.publish('app:timer', new Date());
    this.events.publish('post:changed', 0);
  }
}
