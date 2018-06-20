import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { FormGroup, FormControl, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-authentication',
  templateUrl: 'authentication.html'
})

export class AuthenticationPage {
  form: FormGroup;

  authLoading: boolean = false;
  authState: number = 0;

  authMessage: string = 'Login';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  
  ) { }

  ionViewDidLoad() {
    this.generateForm()
  }

  private generateForm() {
    this.form = new FormGroup({
      email:    new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
  }

  login() {
    this.navCtrl.push('TabsPage')
  }
}
