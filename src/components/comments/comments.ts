import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from 'ionic-angular';

import * as Tribute from "tributejs";

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
    
  ) {


    // domNode.addEventListener('tribute-replaced', _onChange.bind(this));
  }

  private getMentions(text: string, tags) {
    this.metaProvider.mentions(text)
  }

  private getTags(text: string, tags) {
    this.metaProvider.tags(text)
  }

  ngOnInit() {
    this.getComments()

  }

  private getComments() {
    this.commentProvider.load(this.post._id.$oid).subscribe((comments: Comment[]) => {
      this.comments = comments

      // const mentions = {
      //   trigger: "@",
      //   noMatchTemplate: null,
      //   values: (text, cb) => {
      //     this.getMentions(text, tags => cb(tags));
      //   },
      //   lookup: function (user) {
      //     // return  "@" + user.username + " - "+ user.name;
      //     return  "@" + user;
      //   },
      //   selectTemplate: function (item) {
      //     return '<span class="badge badge-secondary" contenteditable="false">@' + item.original.username + '</span>&nbsp;';
      //   },
      //   fillAttr: 'value'
      // };
  
      // // const hashtags = {
      // //   trigger: "#",
      // //   noMatchTemplate: null,
      // //   values: (text, cb) => {
      // //     this.getTags(text, tags => cb(tags));
      // //   },
      // //   selectTemplate: function (item) {
      // //     return '<span contenteditable="false">' + item.original.display_text + '</span>&nbsp;';
      // //   },
      // //   lookup: 'display_text_without_hashtag',
      // //   fillAttr: 'display_text_without_hashtag'
      // // };
      // const tribute = new Tribute({
      //   collection: [mentions]
      // })
      // tribute.replaceTextSuffix = "";
      // tribute.attach(document.querySelectorAll('.mentionable'));
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

  public viewProfile(userID: string) {
    const modal = this.modalCtrl.create('ProfilePage', {
      id: userID
    });

    modal.present();
  }

  public submit() {
    this.processingComment = true;

    this.commentProvider.create(this.post._id.$oid, this.form.value).subscribe((response: any) => {
      this.processingComment = false;
  
      if (this.limit === this.comments.length) {
        this.increment(1)
      }

      this.comments.push(response.comment);
      this.form.reset();
    })
  }

  public viewAll() {
    this.increment(this.comments.length - 1)
  }

  private increment(count: number) {
    this.limit += count
  }
}
