import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CommentProvider } from '../../providers/comment';

import { Post } from '../../models/post';
import { Comment } from '../../models/comment';
import { User } from '../../models/user';

@Component({
  selector: 'comments',
  templateUrl: 'comments.html'
})

export class CommentsComponent implements OnInit {
  @Input() post: Post;
  @Input() user: User;
  @Input() limit: number = 1;

  comments: Comment[] = [];
  form: FormGroup;

  processingComment: boolean = false;

  constructor(
    public commentProvider: CommentProvider
    
  ) { }

  ngOnInit() {
    this.getComments()
  }

  private getComments() {
    this.commentProvider.load(this.post.uuid).subscribe((comments: Comment[]) => {
      this.comments = comments

      this.generateForm()
    })
  }

  public generateForm(comment?: Comment) {
    const newComment = new Comment({
      body: comment ? comment.body : ''
    });

    this.form = new FormGroup({
      body: new FormControl(newComment.body, Validators.required),
    })
  }

  public submit() {
    this.processingComment = true;

    this.commentProvider.create(this.post.uuid, this.form.value).subscribe((response: any) => {
      this.processingComment = false;
  
      if (this.limit === this.comments.length) {
        this.increment(1)
      }

      this.comments.push(response.comment);
    })
  }

  public viewAll() {
    this.increment(this.comments.length - 1)
  }

  private increment(count: number) {
    this.limit += count
  }
}
