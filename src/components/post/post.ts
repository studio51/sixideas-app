import { Component, Input } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { Post } from '../../models/post';
import { User } from '../../models/user';

@Component({
  selector: 'post',
  templateUrl: 'post.html'
})

export class PostComponent {
  @Input() post: Post;
  @Input() author: User;
  @Input() user: User;

  constructor(
    public modalCtrl: ModalController
  
  ) { }

  public editPost() {
    const modal: any = this.modalCtrl.create('PostFormPage', {
      id: this.post._id.$oid,
      post: this.post
    });

    modal.present();
    modal.onDidDismiss((post: Post) => {
      Object.assign(this.post, post)
    })
  }
}