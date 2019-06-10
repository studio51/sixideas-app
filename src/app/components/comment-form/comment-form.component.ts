import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Post } from '../../interfaces/post';
import { Comment } from '../../interfaces/comment';
import { CommentResponse } from '../../interfaces/comment_response';

import { CommentProvider } from 'src/app/providers/comment';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
})
export class CommentFormComponent implements OnInit {
  public form: FormGroup;

  @Input() post: Post;
  @Input() comments: Comment[] = [];

  @Output() commented = new EventEmitter<Comment>();

  constructor(
    public commentProvider: CommentProvider

  ) { }

  async ngOnInit(comment?: any) {
    comment = new Comment({ body: comment ? comment.body : '' });

    this.form = new FormGroup({
      body: new FormControl(comment.body, Validators.required)
    });
  }

  public async submit() {
    const response: CommentResponse = await this.commentProvider.create(this.post._id.$oid, this.form.value);

    if (response.status === 'ok') {
      this.commented.emit(response.comment);
    } else {
      // TODO: Notify
    }
  }
}
