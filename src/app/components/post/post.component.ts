import { Component, Input, OnInit } from '@angular/core';

import { ModalController, ActionSheetController, AlertController } from '@ionic/angular';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

import { PostPage } from 'src/app/pages/post/post.page';
import { PostFormPage } from 'src/app/pages/post-form/post-form.page';

import { Post } from '../../interfaces/post';
import { User } from '../../interfaces/user';
import { Comment } from '../../interfaces/comment';

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
});

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})

export class PostComponent implements OnInit {
  @Input() post: Post;
  @Input() author: User;
  @Input() user: User;

  comments: Comment[] = [];

  public likes: number = 0;

  tributeOptions: any = {}

  constructor(
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public commentProvider: CommentProvider,
    public photoViewer: PhotoViewer

  ) { }

  async ngOnInit() {
    this.likes = (this.post.likes ? this.post.likes.length : 0);

    // if (this.comments.length === 0) {
      this.comments = await this.commentProvider.load(this.post._id.$oid);
    // }
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

  public async viewImage(post: Post) {
    this.photoViewer.show(post.image_url, post.title);
  }

  public async showPostOptions() {
    const actionSheet = await this.actionSheetCtrl.create({
      translucent: true,
      cssClass: 'user-action-sheet',
      buttons: [{
        text: 'Edit',
        icon: 'create',

        handler: () => {
          this.edit();
        }
      }, {
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',

        handler: () => {
          this.showConfirmation();
        }
      }]
    });

    await actionSheet.present();
  }

  private async showConfirmation() {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure?',
      message: "There's no going back!",
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary'
      }, {
        text: 'Yes',
        handler: () => {
          this.delete();
        }
      }]
    });

    await alert.present();
  }

  private async edit() {
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

  private async delete() {
    // TODO
  }

  public refreshComments(comment: Comment) {
    if (this.post.comments_count > 3) {
      this.comments.pop();
    }

    this.comments.unshift(comment);
    this.post.comments_count += 1;
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