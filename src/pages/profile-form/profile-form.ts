import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { User } from '../../models/user';

@IonicPage()
@Component({
  selector: 'page-profile-form',
  templateUrl: 'profile-form.html',
})

export class ProfileFormPage {
  form: FormGroup;

  user: User;
  currentUser: User;

  postColours: Array<{
    name: string,
    hex: string 
  }>;

  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams
  
  ) {

    this.postColours = [
      { name: 'Default', hex: '#ffffff' },
      { name: 'Blue',    hex: '#007bff' },
      { name: 'Green',   hex: '#28a745' },
      { name: 'Yellow',  hex: '#ffc107' },
      { name: 'Red',     hex: '#dc3545' }
    ]

    this.currentUser = {
      id: 2,
      email: 'pacMakaveli90@gmail.com',
      name: "Vlad Radulescu",
      username: "pacMakaveli",
      surname: "Vlad",
      forename: "Radulescu",
      background: "https://res.cloudinary.com/dwvwdhzvg/image/upload/c_fill,h_270,w_1440/nciqyiykd7fya5c9ul0d",
      avatar: "https://randomuser.me/api/portraits/lego/6.jpg",
      colour: "#195097",
      tag: "@pacMakaveli",
      bio: "",
      following: [],
      followers: [{ id: 1 }, { id: 3 }],
      likes: [],
      interests: [
        { name: 'Design' },
        { name: 'Graphics' },
        { name: 'Technology' },
        { name: 'Health' },
        { name: 'EducatingTheFuture' },
        { name: 'BookClub' }
      ],
      online: true
    }

    this.user = new User(navParams.get('user') || this.currentUser);
  }

  initialize() { }

  ionViewDidLoad() { 
    this.generateForm()
  }

  private generateForm() {
    this.form = new FormGroup({
      email:    new FormControl(this.user.email, Validators.required),
      username: new FormControl({
        value: this.user.username,
        disabled: true

      }, Validators.required),

      colour: new FormControl(this.user.colour),

      forename:  new FormControl(this.user.forename, Validators.required),
      surname:   new FormControl(this.user.surname, Validators.required),
      bio:       new FormControl(this.user.bio),
      interests: new FormControl(this.user.interests),

      password:              new FormControl(this.user.password),
      password_confirmation: new FormControl(this.user.code)
    })
  }

  update(formValues?: {}) {
    this.viewCtrl.dismiss(formValues)
  }
}