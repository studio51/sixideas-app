import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IonicPage, ModalController, NavParams } from 'ionic-angular';

import { User } from '../../models/user';
import { UserProvider } from '../../providers/user';

import { Post } from '../../models/post';
import { PostProvider } from '../../providers/post';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})

export class ProfilePage {
  user: User;
  posts: Post[] = [];

  commentForm: FormGroup;
  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public postProvider: PostProvider
  
  ) {

    // this.commentForm = new FormGroup({
    //   body: new FormControl('', Validators.required)
    // })
  }

  ionViewDidLoad() {
    this.getUser()
  }

  getUser() {
    this.userProvider.get(this.navParams.get('id') || '5b374f7f96e80db323df2942').subscribe((user: User) => {
      this.user = user;

      this.postProvider.load(user.uuid).subscribe((posts: Post[]) => {
        this.posts = posts
      })
    })
  }

  // editProfile() {
  //   const profileFormModal = this.modalCtrl.create('ProfileFormPage');
  //         profileFormModal.present();

  //   profileFormModal.onDidDismiss((userChanges: User) => {
  //     if (userChanges) {
  //       this.user = Object.assign(this.user, userChanges)
  //     }
  //   })
  // }
  
  // addComment(postID: number) {    
  //   const comment: any = {};
  //         comment.body = this.commentForm.value.body;
  //         comment.author = this.currentUser;

  //   const post = this.posts.find((post: any) => post.id === postID);
  //         post.comments.push(comment)

  // }
}