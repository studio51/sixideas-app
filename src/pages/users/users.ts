import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { User } from '../../models/user';

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})

export class UsersPage {
  users: User[] = [];
  currentUser: User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams

  ) {

    let users = [
      {
        id: 1,
        name: "Richard Adams",
        background: "",
        avatar: "https://randomuser.me/api/portraits/lego/7.jpg",
        colour: "#195097",
        tag: "@madwire",
        bio: "",
        following: [{ id: 1 }],
        followers: [{ id: 1 }, { id: 3 }, { id: 4 }], // Users
        likes: [{ id: 1 }], // Posts
        interests: [
          { name: 'Design' },
          { name: 'Graphics' },
          { name: 'Technology' },
          { name: 'Sustainability' },
          { name: 'Travel' },
          { name: 'Innovation' },
          { name: 'Future' },
          { name: 'Media' }
        ],
        online: true
      },
      {
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
      },
      {
        id: 3,
        name: "Simon Russell",
        background: "https://res.cloudinary.com/dwvwdhzvg/image/upload/c_fill,h_270,w_1440/l8bujz96dl0lchcthwfj",
        avatar: "https://randomuser.me/api/portraits/lego/2.jpg",
        colour: "#6F6F6F",
        tag: "@usable",
        bio: "We deliver cloud-base product platforms that transform the way organisations communicate, share, and process operational information.",
        following: [],
        followers: [{ id: 1 }, { id: 3 }, { id: 4 }, { id: 2 }], // Users
        likes: [{ id: 1 }, { id: 2 }, { id: 4 }, { id: 6 }, { id: 8 }], // Posts
        interests: [
          { name: 'Design' },
          { name: 'Graphics' },
          { name: 'Technology' },
          { name: 'Health' }
        ],
        online: false
      },
      {
        id: 4,
        name: "Simon Jones",
        background: "",
        avatar: "https://randomuser.me/api/portraits/lego/3.jpg",
        colour: "#009989",
        tag: "@simonpjones",
        bio: "",
        following: [{ id: 1 }],
        followers: [{ id: 1 }, { id: 3 }],
        likes: [],
        interests: [
          { name: 'Internet of Things' },
          { name: 'Future' }
        ],
        online: true
      }
    ];

    for (let user of users) {
      this.users.push(new User(user));
    }

    this.currentUser = this.users[1]
  }

  ionViewDidLoad() { }

  viewUserProfile(user: User) {
    this.navCtrl.push('ProfilePage', {
      user: user,
      id: user.id
    })
  }

  userIsFollowingYou(followers: Array<any>) {
     const mappedFollowers: any = followers.map((follower: any) => follower.id);
    return mappedFollowers.includes(this.currentUser.id)
  }

  userIsFollowingMe(followers: Array<any>) {
     const mappedFollowers: any = followers.map((follower: any) => follower.id);
    return mappedFollowers.includes(this.currentUser.id)
  }
}
