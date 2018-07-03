import { Injectable } from '@angular/core';

import { Device } from '@ionic-native/device';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { UserProvider } from './user';

@Injectable()
export class NotificationProvider {
  constructor(
    public push: Push,
    public device: Device,
    public userProvider: UserProvider

  ) { }

  init() {
    console.log('start')

    const options: PushOptions = {
      android: {
        senderID: '990914187678'
      }
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((registration: any) => {
      this.saveToken(registration.registrationId);
    });
  }

	saveToken(token) {
    console.log(token)
    const device = {
      platform: this.device.platform,
      model: this.device.model,
      uuid: this.device.uuid,
      token
    };
    console.log(device)

    this.userProvider.devices(device)
  }
}