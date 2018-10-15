import { Component, Input } from '@angular/core';
import { Broadcaster } from 'ng2-cable';

import { Storage } from '@ionic/storage';

import { User } from '../../models/user';

@Component({
  selector: 'user-avatar',
  templateUrl: 'user-avatar.html'
})

export class UserAvatarComponent {
  @Input() user: User;
  @Input() size: string;

  appearance: any = {
    '0': 'away',
    '1': 'online',
    '2': 'offline'
  }

  public state: any = this.appearance[2];

  constructor(
    public broadcaster: Broadcaster,
    public storage: Storage
  
  ) {
    
    this.checkAppereances();
  }

  private async checkAppereances() {
    const token = await this.storage.get('token');
    
    this.broadcaster.on<string>('AppearanceChannel').subscribe((message: any) => {
      const state: string = (this.user._id.$oid == token ? '1' : message[this.user._id.$oid]);

      if (state) {
        this.state = this.appearance[state];
      }
    });
  }
}
