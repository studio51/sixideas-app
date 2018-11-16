import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from 'ionic-angular';

import { CommentProvider } from '../../providers/comment';
import { MetaProvider } from '../../providers/meta';

import { Post } from '../../models/post';
import { Comment } from '../../models/comment';
import { User } from '../../models/user';
import { Tag } from '../../models/tag';

import { UserProvider } from '../../providers/user';
import { TagProvider } from '../../providers/tag';

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

  record: any;
  query: any;
  users: User[];
  tags: Tag[];

  constructor(
    private modalCtrl: ModalController,
    private commentProvider: CommentProvider,
    private metaProvider: MetaProvider,
    private userProvider: UserProvider,
    private tagProvider: TagProvider
    
  ) { }

  ngOnInit() {
    this.getComments();
  }

  private async getComments() {
    this.comments = await this.commentProvider.load(this.post._id.$oid);
    this.generateForm();
  }

  public generateForm(comment?: Comment) {
    const newComment = new Comment({
      body: comment ? comment.body : ''
    });

    this.form = new FormGroup({
      body: new FormControl(newComment.body, Validators.required)
    });
  }

  public async viewUserProfile(userID: string) {
    const modal = await this.modalCtrl.create('ProfilePage', {
      id: userID
    });

    await modal.present();
  }

  public async submit() {
    this.processingComment = true;

    const response = await this.commentProvider.create(this.post._id.$oid, this.form.value);
    this.processingComment = false;

    if (this.limit === this.comments.length) {
      this.increment(1);
    }

    this.comments.push(response.comment);
    this.form.reset();
  }

  public viewAll() {
    this.increment(this.comments.length - 1);
  }

  private increment(count: number) {
    this.limit += count;
  }

  public replaceText(value: string) {
    const body: any = this.form.controls.body;
    
    if (this.query.startsWith('@')) {
      body.setValue(body.value.replace(this.query.replace('@@', '@'), `@${ value }`));
    } else {
      body.setValue(body.value.replace(this.query.replace('##', '#'), value));
    }

    this.query = '';
  }

  public async checkContent(event: any) {
    const value: string = event.value;

    if (event.type === 'keyup') {
      const moveOn: boolean = (event.code === 'Space' || event.key === ' ');
      const ignoredChar: boolean = event.key === 'Shift' || event.key === 'Backspace';

      if (moveOn) {
        this.record = false;
        this.query = '';

        this.users = this.tags = [];

        return
      }

      if (event.key.startsWith('@')) {
        this.record = true;
        this.query = '@';
      }

      if (this.record && this.query.startsWith('@') && this.query.length > 0) {
        if (event.code === 'Backspace') {
          this.query = this.query.slice(0, -1);
          this.users = await this.userProvider.load(this.query);
        } else {
          if (!ignoredChar) {
            this.query += event.key;
            this.users = await this.userProvider.load(this.query);
          }
        }
      }

      if (event.key.startsWith('#')) {
        this.record = true;
        this.query = '#';
      }

      if (this.record && this.query.startsWith('#') && this.query.length > 0) {
        if (event.code === 'Backspace') {
          this.query = this.query.slice(0, -1);
          this.tags = await this.tagProvider.load(this.query);
        } else {
          if (!ignoredChar) {
            this.query += event.key;
            this.tags = await this.tagProvider.load(this.query);
          }
        }
      }
    } else if (event.type === 'text') {
      
    } else {
      return
    }
  }
}
