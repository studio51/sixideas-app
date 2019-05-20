import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { UserCardPage } from 'src/app/pages/user-card/user-card.page';

import { AppereanceService } from 'src/app/services/appearance.service';
import { DomSanitizer } from '@angular/platform-browser';

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
  @Input() color: string = 'dark';

  @Input() subHeader: any = null;
  @Input() showUsername: boolean = false;
  @Input() hasOwnListener: boolean = false;

  @Output() listener = new EventEmitter<number>();

  @Input() appearance: string = UserState[2];

  constructor(
    public modalCtrl: ModalController,
    public appearanceService: AppereanceService,
    public sanitizer: DomSanitizer

  ) { }

  ngOnInit() {
    this.appearanceService.change.subscribe((user: any) => {
      if (this.user._id.$oid === user['uuid']) {
        this.appearance = UserState[user['state']];
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
    // this.appearanceService.change.unsubscribe();
  }

  public sanitize(image: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(image);
  }
}
