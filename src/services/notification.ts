import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Observable } from 'rxjs';

@Injectable()
export class NotificationService {
  pushObject: PushObject;
  
  constructor(
    public platform: Platform,
    public push: Push
  
  ) { }

  init() {
    const options: PushOptions = {
      android: {
        senderID: '990914187678'
      }
    }

    if (this.platform.is('cordova')) {
      this.pushObject = this.push.init(options)
    }
  }

  public register() {
    this.init();

    if (this.platform.is('cordova')) {
      return this.pushObject.on('registration')
    } else {
      return Observable.of('')
    }
  }

  public notify() {
    this.init();

    if (this.platform.is('cordova')) {
      return this.pushObject.on('notification')
    } else {
      return Observable.of('')
    }
  }

  public error() {
    this.init();

    if (this.platform.is('cordova')) {
      return this.pushObject.on('error')
    } else {
      return Observable.of('')
    }
  }
}