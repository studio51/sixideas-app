import { Component } from '@angular/core';
import { ComponentRef } from '@ionic/core';
import { ModalController, ActionSheetController } from '@ionic/angular';

import { UserProvider } from 'src/app/providers/user';
import { User } from 'src/app/interfaces/user';

import { UserPage } from '../user/user.page';
import { UserEditPage } from '../user-edit/user-edit.page';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})

export class TabsPage {
  user: User;

  constructor(
    public userProvider: UserProvider,
    public modalCtrl: ModalController,
    public actionSheetController: ActionSheetController

  ) {

    this.getCurrentUser();
  }

  public async getCurrentUser() {
    this.user = await this.userProvider.current();
  }

  public async showUserActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      translucent: true,
      cssClass: 'user-action-sheet',
      buttons: [{
        text: `@${ this.user.username }!`,
        icon: 'finger-print',

        handler: () => {
          this.goTo(UserPage);
        }
      }, {
        text: 'Settings',
        icon: 'cog',

        handler: () => {
          this.goTo(UserEditPage);
        }
      }, {
        text: 'Sign Out',
        role: 'destructive',
        icon: 'log-out',

        handler: () => {
          this.signOut();
        }
      }]
    });

    await actionSheet.present();
  }

  private async goTo(page: ComponentRef) {
    const modal: any = await this.modalCtrl.create({
      component: page,
      componentProps: {
        id: this.user._id.$oid
      }
    });

    return await modal.present();
  }

  private async signOut() { }
}
