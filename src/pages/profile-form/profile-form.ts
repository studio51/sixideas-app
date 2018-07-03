import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { forkJoin } from 'rxjs/observable/forkJoin';

import { IonicPage, ViewController, NavParams } from 'ionic-angular';

import { User } from '../../models/user';
import { UserProvider } from '../../providers/user';

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
    public navParams: NavParams,
    public userProvider: UserProvider
  
  ) { }

  ionViewDidLoad() { 
    this.getUserAndMeta()
  }

  private getUserAndMeta() {
    forkJoin([
      this.userProvider.get(this.navParams.get('id') || '5b374f7f96e80db323df2942'),
      this.userProvider.colours(),
      this.userProvider.interests()
    
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

  submit(update: boolean = true) {
    if (update) {
      this.userProvider.update(this.user.uuid, this.form.value).subscribe((user: User) => {
        this.dismissView(user)
      })
    } else {
      this.dismissView()
    }
  }

  private dismissView(data?: { }) {
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