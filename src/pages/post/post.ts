import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

import { User } from '../../models/user';
import { Post } from '../../models/post';

import { SessionProvider } from '../../providers/session';
import { PostProvider } from '../../providers/post';

@IonicPage({ segment: 'post/:id' })
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})

export class PostPage {
  user: User;
  post: Post;

  constructor(
    private navParams: NavParams,
    private sessionProvider: SessionProvider,
    private postProvider: PostProvider
  
  ) { }

  ionViewDidLoad() {
    this.getPost();
  }

  private async getPost() {
    this.user = await this.sessionProvider.user();
    this.post = await this.postProvider.get(this.navParams.get('id'), {
      include_author: true
    });
  }
}
