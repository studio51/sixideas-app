import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { forkJoin } from 'rxjs/observable/forkJoin';

import { IonicPage, ViewController } from 'ionic-angular';

import { User } from '../../models/user';

import { SessionProvider } from '../../providers/session';
import { UserProvider } from '../../providers/user';
import { MetaProvider } from '../../providers/meta';

@IonicPage()
@Component({
  selector: 'page-profile-form',
  templateUrl: 'profile-form.html',
})

export class ProfileFormPage {
  user: User;
  form: FormGroup;

  colours: Array<any> = [];
  interests: Array<any> = [];

  constructor(
    public viewCtrl: ViewController,
    public sessionProvider: SessionProvider,
    public userProvider: UserProvider,
    public metaProvider: MetaProvider
  
  ) { }

  ionViewDidLoad() { 
    this.getUserAndMeta()
  }

  private getUserAndMeta() {
    forkJoin([
      this.sessionProvider.user(),
      this.metaProvider.colours(),
      this.metaProvider.interests()
    
    ]).subscribe((response: Array<any>) => {
      this.user = response[0];
      this.colours = response[1];
      this.interests = response[2];

      this.generateForm();
    })
  }

  private generateForm() {
    this.form = new FormGroup({
      profile_banner: new FormControl(this.user.avatar_url),
      avatar: new FormControl(this.user.avatar_url),

      colour: new FormControl(this.user.colour),

      email:    new FormControl(this.user.email, Validators.required),
      username: new FormControl({
        value: this.user.username,
        disabled: true

      }, Validators.required),

      forename:  new FormControl(this.user.forename, Validators.required),
      surname:   new FormControl(this.user.surname, Validators.required),
      bio:       new FormControl(this.user.bio),
      interests: new FormControl(this.user.interests),

      password:              new FormControl(this.user.password),
      password_confirmation: new FormControl(this.user.password_confirmation)
    })
  }

  changeformColour(colour: string) {
    this.user.colour = colour;
    this.form.controls.colour.setValue(colour);
  }

  submit() {
    this.userProvider.update(this.user._id.$oid, this.form.value).subscribe((response: any) => {
      if (response.status === 'ok') {
        this.dismissView(response.user)
      } else {
        console.log('error')
      }
    })
  }

  public dismissView(data?: { }) {
    this.viewCtrl.dismiss(data)
  }

  // private validatePassword(AC: AbstractControl) {
  //   const password = this.form.controls.getValue('password');
  //   const password_confirmation = this.form.controls.getValue('password_confirmation');
  
  //   if (password != password_confirmation) {
  //     AC.get('password_confirmation').setErrors( { validatePassword: true } )
  //   } else {
  //     return null
  //   }
  // }
}