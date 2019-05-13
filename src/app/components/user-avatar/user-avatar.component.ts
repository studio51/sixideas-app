import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { UserCardPage } from 'src/app/pages/user-card/user-card.page';

import { AppereanceService } from 'src/app/services/appearance.service';

// import { MessageService } from './shared/messages/message.service';

// enum AvatarSize {
//   T = 'tiny',
//   S = 'small',
//   M = 'medium',
//   L = 'large',
//   B = 'big',
//   H = 'huge'
// }

enum UserState { 'away', 'online', 'offline' }

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})

export class UserAvatarComponent implements OnInit, OnDestroy {
  @Input() user: any;
  @Input() size: string; // AvatarSize = AvatarSize.T;
  @Input() color: string = 'medium';

  @Input() subHeader: any = null;
  @Input() showUsername: boolean = false;
  @Input() hasOwnListener: boolean = false;

  @Output() listener = new EventEmitter<number>();

  @Input() appereance: string = UserState[2];

  constructor(
    public modalCtrl: ModalController,
    private appereanceService: AppereanceService

  ) { }

  ngOnInit() {
    this.appereanceService.change.subscribe((user: any) => {
      if (this.user._id.$oid === user['uuid']) {
        this.appereance = UserState[user['state']];
      }
    });
  }

  public async view() {
    if (this.hasOwnListener) {
      this.listener.emit();
    } else {
      const modal: any = await this.modalCtrl.create({
        component: UserCardPage,
        componentProps: {
          id: this.user._id.$oid
        }
      });

      return await modal.present();
    }
  }

  ngOnDestroy() {
    // this.appereanceService.change.unsubscribe();
  }
}
