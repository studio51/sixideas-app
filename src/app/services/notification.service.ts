import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { Firebase } from '@ionic-native/firebase/ngx';

import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
    private platform: Platform,
    private firebase: Firebase,
    private afs: AngularFirestore

  ) { }

  async get() {
    let token;

    // if (this.platform.is('android')) { }
    if (this.platform.is('ios')) {
      token = await this.firebase.getToken();
      await this.firebase.grantPermission();
    }

    console.log('from here', token);

    this.firebase.onNotificationOpen().subscribe((data) => {
      console.log('something')
      console.log(data)
    })

    this.firebase.onTokenRefresh().subscribe((data) => {
      console.log('something')
      console.log(data)
    })

    this.save(token);
  }

  private save(token: any) {
    if (!token) return;

    const devicesRef = this.afs.collection('devices');
    const data = { token, userId: 'testUserId' };

    return devicesRef.doc(token).set(data);
  }

  onNotifications() {
    return this.firebase.onNotificationOpen();
  }
}