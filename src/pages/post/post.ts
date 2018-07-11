import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { User } from '../../models/user';
import { Post } from '../../models/post';

import { SessionProvider } from '../../providers/session';
import { PostProvider } from '../../providers/post';

@IonicPage({
  segment: 'post/:id'
})

@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})

export class PostPage {
  user: User;
  post: Post;

  constructor(
    public navParams: NavParams,
    public sessionProvider: SessionProvider,
    public postProvider: PostProvider
  
  ) { }

  ionViewDidLoad() {
    this.getPost()
  }

  private getPost() {
    this.sessionProvider.user().subscribe((user: User) => {
      this.user = user;

      this.postProvider.get(this.navParams.get('id'), { include_author: true }).subscribe((post: Post) => {
        this.post = post
      });
    })
  }
}
