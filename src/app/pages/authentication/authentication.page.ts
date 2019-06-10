import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { HttpResponse } from '@angular/common/http';

import { SessionProvider } from 'src/app/providers/session';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.page.html',
  styleUrls: ['./authentication.page.scss'],
})
export class AuthenticationPage implements OnInit {
  form: FormGroup;
  authentication: HttpResponse<any> = null;

  constructor(
    public storage: Storage,
    public sessionProvider: SessionProvider

  ) { }

  ngOnInit() {
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
      await this.storage.set('sixideas-token', response.user._id.$oid);

      this.authentication = null;
      // this.navCtrl.setRoot('TabsPage');
    } else {
      this.authentication = response;
    }
  }
}
