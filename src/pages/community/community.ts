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
      this.setTag(navParams.get('tag'))
    }

    this.subscribeToTabChangedEvents();
    this.subscribeToPostChangedEvents();
    this.subscribeToPostTaggedEvents();
  }

  async ionViewDidEnter() {
    const user = await this.sessionProvider.user()
    
    this.user = user;
    this.tags = user.interests;

    this.getPosts();
  }

  public showTags() {
    const tagsModal = this.modalCtrl.create('TagsPage', {
      tag: this.tag
    });
  
    tagsModal.present();
    tagsModal.onDidDismiss((tag: string) => {
      if (tag) {
        this.getTaggedPosts(tag)
      }
    })
  }

  private getTaggedPosts(tag: string) {
    if (this.feed != 'community') {
      this.feed = 'community'
    }
    
    this.setTag(tag);
    this.getPosts();
  }

  public refresh(refresher?: any) {
    if (refresher) {
      this.refresher = refresher
    } else {
      this.showLoadingIndicator = true
    }

    this.getPosts();
  }

  public feedChanged(event: any) {
    this.showLoadingIndicator = true;
    
    this.setTag(null);
    this.getPosts(event.value)
  }

  private async getPosts(feed?: string) {
    this.showLoadingIndicator = true;

    const params = {}
          params['include_author'] = true
    
    if (this.tag) { params['tag'] = this.tag }
    if (feed && feed != 'community') { params['feed'] = feed }

    this.posts = await this.postProvider.load('', params);
    this.showLoadingIndicator = false;

    console.log(this.posts)

    if (this.refresher) {
      this.refresher.complete()
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

  private subscribeToTabChangedEvents() {
    this.events.subscribe('tab:changed', (data: any) => {
      if (data) {
        switch(data.want) {
          case 'tagged':
            this.tag = data['tag'];
            break;
          case 'likes':
            this.feed = 'likes';
            break;
        }
      }
    })
  }

  private subscribeToPostChangedEvents() {
    this.events.subscribe('post:changed', (counter: number) => {
      this.newPostsCounter = counter;
    })
  }
  
  private subscribeToPostTaggedEvents() {
    this.events.subscribe('post:tagged', (data: any) => {
      
      this.getTaggedPosts(data['tag']);
    })
  }

  private setTag(tag: string) { this.tag = tag }

  private resetTimer() {
    this.events.publish('app:timer', new Date());
    this.events.publish('post:changed', 0);
  }
}
