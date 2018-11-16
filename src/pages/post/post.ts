import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

import { User } from '../../models/user';
import { Post } from '../../models/post';
import { Comment } from '../../models/comment';

import { SessionProvider } from '../../providers/session';
import { PostProvider } from '../../providers/post';
import { CommentProvider } from '../../providers/comment';

@IonicPage({ segment: 'post/:id' })
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})

export class PostPage {
  user: User;
  post: Post;

  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private sessionProvider: SessionProvider,
    private postProvider: PostProvider,
    private commentProvider: CommentProvider
  
  ) { }

  ionViewDidLoad() {
    this.getPost();
  }

  private async getPost() {
    this.user = await this.sessionProvider.user();

    let id: string = this.navParams.get('id');
    const scope: 'Comment' | 'Post' = this.navParams.get('scope');
    
    if (scope && scope === 'Comment') {
      const comment: Comment = await this.commentProvider.get(id);
      id = comment.commentable_id.$oid;
    }

    this.post = await this.postProvider.get(id, {
      include_author: true
    });
  }

  public async dismissView() {
    await this.viewCtrl.dismiss();
  }
}
