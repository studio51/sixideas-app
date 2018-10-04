import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from 'ionic-angular';

import { CommentProvider } from '../../providers/comment';
import { MetaProvider } from '../../providers/meta';

import { Post } from '../../models/post';
import { Comment } from '../../models/comment';
import { User } from '../../models/user';

@Component({
  selector: 'comments',
  templateUrl: 'comments.html'
})

export class CommentsComponent implements OnInit {
  @Input() post: Post;
  @Input() author: User;
  @Input() user: User;
  @Input() limit: number = 1;

  comments: Comment[] = [];
  form: FormGroup;

  processingComment: boolean = false;

  constructor(
    public modalCtrl: ModalController,
    public commentProvider: CommentProvider,
    public metaProvider: MetaProvider
    
  ) { }

  ngOnInit() {
    this.getComments()
  }

  private async getComments() {
    this.comments = await this.commentProvider.load(this.post._id.$oid)
    this.generateForm();
  }

  public generateForm(comment?: Comment) {
    const newComment = new Comment({
      body: comment ? comment.body : ''
    });

    this.form = new FormGroup({
      body: new FormControl(newComment.body, Validators.required),
    })
  }

  public viewProfile(userID: string) {
    const modal = this.modalCtrl.create('ProfilePage', {
      id: userID
    });

    modal.present();
  }

  public async submit() {
    this.processingComment = true;

    const response = await this.commentProvider.create(this.post._id.$oid, this.form.value);
    this.processingComment = false;

    if (this.limit === this.comments.length) {
      this.increment(1)
    }

    this.comments.push(response.comment);
    this.form.reset();
  }

  public viewAll() {
    this.increment(this.comments.length - 1)
  }

  private increment(count: number) {
    this.limit += count
  }
}
