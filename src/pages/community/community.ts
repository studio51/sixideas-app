import { Component } from '@angular/core';
import { IonicPage, ModalController } from 'ionic-angular';

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

  feed: string = 'community';

  constructor(
    public modalCtrl: ModalController,
    public storage: Storage,
    public userProvider: UserProvider,
    public postProvider: PostProvider
  
  ) { }

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
    
    if (feed && feed != 'community') { params['feed'] = feed }

    this.postProvider.load('', params).subscribe((posts: Post[]) => {
      this.posts = posts
      this.showLoadingIndicator = false;
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
