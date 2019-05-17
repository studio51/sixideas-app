import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { NavParams, IonInfiniteScroll } from '@ionic/angular';

import { Post } from 'src/app/interfaces/post';
import { User } from 'src/app/interfaces/user';
import { Comment } from 'src/app/interfaces/comment';

import { CommentProvider } from 'src/app/providers/comment';
import { PostProvider } from 'src/app/providers/post';

@Component({
  selector: 'app-post-page',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss']
})

export class PostPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  @Input() id: string;
  @Input() post: Post;
  @Input() user: User;

  comments: Comment[] = [];

  private page: number = 0;

  constructor(
    public navParams: NavParams,
    public postProvider: PostProvider,
    public commentProvider: CommentProvider

  ) { }

  async ngOnInit() {
    if (!this.post) {
      this.post = await this.postProvider.get(this.id);
    }

    this.getComments();
  }

  public async getComments(event?: any) {
    const params = {};
          params['page'] = this.page += 1;
          params['limit'] = 10;

    const response = await this.commentProvider.load(this.id, params);

    if (this.page === 1) {
      this.comments = response;
    } else {
      response.forEach((post: Post) => this.comments.push(post));
    }

    this.disableInfiniteScroll(response, event);
  }

  private disableInfiniteScroll(response: Post, event: any) {
    if (event) {

      event.target.complete();

      // Disable the Infinite scroll event listeners
      //
      if ((event.type === 'ionInfinite') && (response.length === 0)) {
        this.infiniteScroll.disabled = true;
      }
    }
    return;
  }
}
