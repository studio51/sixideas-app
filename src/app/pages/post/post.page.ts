import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { NavParams, IonInfiniteScroll, ModalController } from '@ionic/angular';

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

  // @Input() commentID: string;

  comments: Comment[] = [];

  private page: number = 0;

  constructor(
    public navParams: NavParams,
    public modalCtrl: ModalController,
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

  public refreshComments(comment: Comment) {
    // if (this.post.comments_count > 3) {
    //   this.comments.pop();
    // }

    this.comments.unshift(comment);
    this.post.comments_count += 1;
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

  public onLikeableDecision(likesCount) {
    // this.likes = likesCount;
  }

  public timeAgoInWords(date: string): string {
    // @ts-ignore
    return new Date(date).relative();
  }

  public day(date: string): string {
    // @ts-ignore
    return new Date(date).format('%d');
  }

  public month(date: string): string {
    // @ts-ignore
    return new Date(date).format('%b');
  }

  public async dismiss() {
    return await this.modalCtrl.dismiss();
  }
}
