import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IonicPage, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { SessionProvider } from '../../providers/session';
import { HttpResponse } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-authentication',
  templateUrl: 'authentication.html'
})

export class AuthenticationPage {
  form: FormGroup;
  authentication: HttpResponse<any> = null;

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
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
    });
  }

  async submit() {
    const response: any = await this.sessionProvider.authenticate(this.form.value);

    if (response.success) {
      await this.storage.set('token', response.user._id.$oid);

      this.authentication = null;
      this.navCtrl.setRoot('TabsPage');
    } else {
      this.authentication = response;
    }
  }
}
