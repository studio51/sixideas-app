import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

import { UserProvider } from 'src/app/providers/user';
import { User } from 'src/app/interfaces/user';
import { UserPage } from '../user/user.page';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.page.html',
  styleUrls: ['./user-card.page.scss'],
})

export class UserCardPage implements OnInit {
  user: User;

  constructor(
    public userProvider: UserProvider,
    public navParams: NavParams,
    public modalCtrl: ModalController

  ) { }

  async ngOnInit() {
    this.user = await this.userProvider.get(this.navParams.get('id'))
  }

  public async view() {
    const modal: any = await this.modalCtrl.create({
      component: UserPage,
      componentProps: {
        id: this.user._id.$oid
      }
    });

    return await modal.present();
  }

  public async dismiss() {
    return await this.modalCtrl.dismiss();
  }
}
