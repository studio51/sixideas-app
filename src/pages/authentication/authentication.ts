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

  submit() {
    this.login(this.form.value).subscribe((response: any) => {
      if (response.success) {
        this.authentication = null;

        this.storage.set('token', response.user._id.$oid).then(() => {
          this.sessionProvider.appear().subscribe(() => {
            this.navCtrl.setRoot('TabsPage')
          })
        });
      } else {
        this.authentication = response
      }
    })
  }

  private login(user: any) {
    return this.userProvider.authenticate(user)
  }
}
