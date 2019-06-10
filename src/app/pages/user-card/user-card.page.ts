import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

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

  @Input() id: string;

  constructor(
    public userProvider: UserProvider,
    public modalCtrl: ModalController

  ) { }

  async ngOnInit() {
    this.user = await this.userProvider.get(this.id);
  }

  public async view() {
    const modal: any = await this.modalCtrl.create({
      component: UserPage,
      componentProps: {
        id: this.id,
        user: this.user
      }
    });

    return await modal.present();
  }

  public async dismiss() {
    return await this.modalCtrl.dismiss();
  }
}
