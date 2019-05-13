import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ModalController } from '@ionic/angular';
// import { PhotoViewer } from '@ionic-native/photo-viewer';

import { PostPage } from 'src/app/pages/post/post.page';
import { PostFormPage } from 'src/app/pages/post-form/post-form.page';

import { Post } from '../../interfaces/post';
import { User } from '../../interfaces/user';
import { Comment } from '../../interfaces/comment';
import { CommentResponse } from '../../interfaces/comment_response';

import { CommentProvider } from 'src/app/providers/comment';

// 3rd party plugins
//
import * as Sugar from 'sugar';

// Only use what we need as we don't want to load the entire library
//
// TODO: Look into adding this, maybe, into the app module in order to
// make it available everywhere.
//
Sugar.extend({
  namespaces: [String, Date],
  methods: ['truncate', 'relative', 'format']
})

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})

export class PostComponent implements OnInit {
  @Input() post: Post;
  @Input() author: User;
  @Input() user: User;

  @Input() comments: Comment[] = [];

  public likes: number = 0;

  public commentForm: FormGroup;

  tributeOptions: any = {}

  constructor(
    public modalCtrl: ModalController,
    public commentProvider: CommentProvider
    // public photoViewer: PhotoViewer

  ) { }

  async ngOnInit() {
    this.generateCommentForm();

    this.likes = (this.post.likes ? this.post.likes.length : 0);

    if (this.comments.length === 0) {
      this.comments = await this.commentProvider.load(this.post._id.$oid);
    }
  }

  public async view() {
    const modal: any = await this.modalCtrl.create({
      component: PostPage,
      componentProps: {
        id: this.post._id.$oid,
        post: this.post,
        user: this.user
      }
    });

    return await modal.present();
  }

  public async edit() {
    const modal: any = await this.modalCtrl.create({
      component: PostFormPage,
      componentProps: {
        id: this.post._id.$oid,
        post: this.post,
        user: this.user
      }
    });

    modal.onDidDismiss((changes: Post) => {
      console.log(changes);
    });
    // const { changes } = await 
    // if (changes) {
    //   Object.assign(this.post, changes);
    // }

    return await modal.present();
  }

  public async generateCommentForm(comment?: any) {
    comment = new Comment({ body: comment ? comment.body : '' });

    this.commentForm = new FormGroup({
      body: new FormControl(comment.body, Validators.required)
    });
  }

  public async submitCommentForm() {
    const response: CommentResponse = await this.commentProvider.create(this.post._id.$oid, this.commentForm.value);

    if (response.status === 'ok') {
      if (this.post.comments_count > 3) {
        this.comments.pop();
      }

      this.comments.unshift(response.comment);
      this.post.comments_count += 1;
    } else {
      // TODO: Notify
    }
  }

  public onLikeableDecision(likesCount) {
    this.likes = likesCount;
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
}