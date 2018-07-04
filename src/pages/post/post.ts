import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Post } from '../../models/post';
import { PostProvider } from '../../providers/post';

@IonicPage({
  defaultHistory: ['CommunityPage'],
  name: 'post',
  segment: 'post/:id'
})

@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})

export class PostPage {
  post: Post;
  commentID: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public postProvider: PostProvider
  
  ) { }

  ionViewDidLoad() {
    this.getPost()
  }

  private getPost() {
    this.postProvider.get(this.navParams.get('id'), { include_author: true }).subscribe((post: Post) => {
      this.post = post
    })
  }
}
