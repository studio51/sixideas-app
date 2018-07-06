import { Component } from '@angular/core';
import { IonicPage, Events, NavParams, ModalController } from 'ionic-angular';

import { User } from '../../models/user';
import { Post } from '../../models/post';

import { UserProvider } from '../../providers/user';
import { PostProvider } from '../../providers/post';

@IonicPage()
@Component({
  selector: 'page-community',
  templateUrl: 'community.html',
})

export class CommunityPage {
  user: User;
  posts: Post[] = [];

  showLoadingIndicator: boolean = true;
  postsChanged: boolean = false;

  feed: string = 'community';
  tag: string = null;

  constructor(
    private events: Events,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public userProvider: UserProvider,
    public postProvider: PostProvider
  
  ) {

    if (this.navParams.get('tag')) {
      this.tag = this.navParams.get('tag')
    }

    events.subscribe('posts:changed', (data: any) => {
      this.tag = data['tag'];
      this.postsChanged = true;
      this.getPosts();
    });
  }

  ionViewDidEnter() {
    this.userProvider.get().subscribe((user: User) => {
      this.user = user;
      this.getPosts();
    })
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
      this.postsChanged = false;
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
}
