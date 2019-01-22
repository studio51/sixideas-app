import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { Push, PushObject, PushOptions } from '@ionic-native/push';

@Injectable()
export class NotificationService {
  pushObject: PushObject;
  
  constructor(
    public platform: Platform,
    public push: Push
  
  ) { }

  private async init() {
    const options: PushOptions = {
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      android: {
        senderID: '990914187678'
      },
      browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
    }

    this.pushObject = await this.push.init(options)
  }

  public async check() {
    const permission: any = await this.push.hasPermission();

    if (permission.isEnabled) {
      console.log('We have permission to send Notifications');
    } else {
      console.log("We don't have permission to send Notifications");
    }

    return permission.isEnabled;
  }

  public async register(): Promise<any> {
    await this.init();
    return new Promise((resolve, reject) => this.pushObject.on('registration').subscribe(resolve, reject));
  }

  public async notify(): Promise<any> {
    await this.init();
    return new Promise((resolve, reject) => this.pushObject.on('notification').subscribe(resolve, reject));
  }

  public async error(): Promise<any> {
    await this.init();
    return new Promise((resolve, reject) => this.pushObject.on('error').subscribe(resolve, reject));
  }
}