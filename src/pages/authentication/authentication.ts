import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Storage } from '@ionic/storage';

import { UserProvider } from '../../providers/user';
import { SessionProvider } from '../../providers/session';

@IonicPage()
@Component({
  selector: 'page-authentication',
  templateUrl: 'authentication.html'
})

export class AuthenticationPage {
  form: FormGroup;

  authentication: any = null;

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public userProvider: UserProvider,
    public sessionProvider: SessionProvider
  
  ) { }

  ionViewDidLoad() {
    this.generateForm()
  }

  private generateForm() {
    this.form = new FormGroup({
      user: new FormGroup({
        email: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
      })
    })
  }

  async submit() {
    const response: any = await this.login(this.form.value)

    if (response.success) {
      this.authentication = null;

      await this.storage.set('token', response.user._id.$oid)
      await this.sessionProvider.appear()
      this.navCtrl.setRoot('TabsPage')
    } else {
      this.authentication = response
    }
  }

  private login(user: any) {
    return this.userProvider.authenticate(user)
  }
}
