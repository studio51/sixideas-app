import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController, Events } from '@ionic/angular';

// import { PhotoViewer } from '@ionic-native/photo-viewer';

import { UserPage } from '../../pages/user/user.page';

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

  public likes: number = 0;

  public comments: Comment[] = [];
  public commentForm: FormGroup;

  tributeOptions: any = {}

  constructor(
    public modalCtrl: ModalController,
    public commentProvider: CommentProvider
    // public photoViewer: PhotoViewer

  ) { }

  async ngOnInit() {
    this.generateCommentForm();
    this.getComments();

    this.likes = (this.post.likes ? this.post.likes.length : 0);
  }

  public async showUser(id: string) {
    const modal: any = await this.modalCtrl.create({
      component: UserPage,
      componentProps: {
        id: id
      }
    });

    return await modal.present();
  }

  public async viewPost() {
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

  public async edit() {
    // const modal: any = await this.modalCtrl.create('PostFormPage', {
    //   id: this.post._id.$oid,
    //   post: this.post
    // });

    // await modal.present();
    // await modal.onDidDismiss((post: any /*Post*/) => {
    //   Object.assign(this.post, post);
    // });
  }

  public onLikeableDecision(likesCount) {
    this.likes = likesCount;
  }

  private async getComments() {
    this.comments = await this.commentProvider.load(this.post._id.$oid);
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