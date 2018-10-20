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
    private modalCtrl: ModalController
  
  ) { }

  public async viewUserProfile(userID: string) {
    const modal: any = await this.modalCtrl.create('ProfilePage', {
      id: userID
    });

    await modal.present();
  }

  public async edit() {
    const modal: any = await this.modalCtrl.create('PostFormPage', {
      id: this.post._id.$oid,
      post: this.post
    });

    await modal.present();
    await modal.onDidDismiss((post: Post) => {
      Object.assign(this.post, post);
    });
  }
}