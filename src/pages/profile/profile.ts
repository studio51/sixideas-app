import { Component } from '@angular/core';
import { IonicPage, ModalController, NavParams } from 'ionic-angular';

import { User } from '../../models/user';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})

export class ProfilePage {
  user: User;

  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams
  
  ) {

    const currentUser = {
      id: 2,
      name: "Vlad Radulescu",
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

    this.user = navParams.get('user') || currentUser
  }

  ionViewDidLoad() { }

  editProfile() {
    const profileFormModal = this.modalCtrl.create('ProfileFormPage');
          profileFormModal.present();

    profileFormModal.onDidDismiss((userChanges: User) => {
      if (userChanges) {
        this.user = Object.assign(this.user, userChanges)
      }
    })
  }

  private name() {
    [this.user.surname, this.user.firstname].join(' ')
  }
}