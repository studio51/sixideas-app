import { Component } from '@angular/core';
import { IonicPage, Events, NavParams, ModalController } from 'ionic-angular';

import { User } from '../../models/user';
import { Post } from '../../models/post';

import { SessionProvider } from '../../providers/session';
import { PostProvider } from '../../providers/post';

@IonicPage()
@Component({
  selector: 'page-community',
  templateUrl: 'community.html',
})

export class CommunityPage {
  user: User;
  posts: Post[] = [];

  refresher: any;
  showLoadingIndicator: boolean = true;

  feed: string = 'community';
  tag: string = null;

  newPostsCounter: number = 0;

  constructor(
    public events: Events,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public sessionProvider: SessionProvider,
    public postProvider: PostProvider
  
  ) {

    if (this.navParams.get('tag')) {
      this.tag = this.navParams.get('tag')
    }

    events.subscribe('post:changed', (counter: number) => {
      this.newPostsCounter = counter
    })

    events.subscribe('post:tagged', (data: any) => {
      this.tag = data['tag'];
      this.showLoadingIndicator = true;
      this.getPosts();
    });
  }

  ionViewDidEnter() {
    this.sessionProvider.user().subscribe((user: User) => {
      this.user = user;
      this.getPosts();
    })
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
    this.getPosts(event.value)
  }

  private getPosts(feed?: string) {
    const params = {}
          params['include_author'] = true
    
    if (this.tag) { params['tag'] = this.tag }
    if (feed && feed != 'community') { params['feed'] = feed }

    this.postProvider.load('', params).subscribe((posts: Post[]) => {
      this.posts = posts;
      this.showLoadingIndicator = false;

      if (this.refresher) {
        this.refresher.complete()
      }

      this.resetTimer();
    })
  }

  public newPost() {
    const postFormModal = this.modalCtrl.create('PostFormPage');
  
    postFormModal.present();
    postFormModal.onDidDismiss((post: Post) => {
      if (post) {
        this.posts.push(post)
      }
    })
  }

  private resetTimer() {
    this.events.publish('app:timer', new Date())
    this.events.publish('post:changed', 0)
  }
}
