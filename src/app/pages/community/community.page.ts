import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ToastController, ModalController } from '@ionic/angular';

import { UserProvider } from 'src/app/providers/user';

import { User, UserResponse } from 'src/app/interfaces/user';
import { UserCardPage } from 'src/app/pages/user-card/user-card.page';

import * as Sugar from 'sugar/string';

Sugar.String.extend({
  methods: ['truncate']
});

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})

export class CommunityPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  users: User[] = [];
  followers: User[] = [];
  following: User[] = [];

  user: User;
  currentUser: User;

  filtering: boolean = false;

  public total_users: number = 0;
  private page: number = 0;

  constructor(
    public userProvider: UserProvider,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController

  ) { }

  async ngOnInit() {
    this.currentUser = await this.userProvider.current();
    this.get();
  }

  public async show(user: User) {
    const modal: any = await this.modalCtrl.create({
      component: UserCardPage,
      componentProps: {
        id: user._id.$oid
      }
    });

    return await modal.present();
  }

  public async decide(user: User) {
    let response: any;
    const provider: UserProvider = this.userProvider;

    if (this.iFollow(user)) {
      response = await provider.unfollow(user._id.$oid);

      this.following.splice(this.following.map((user: User) => user._id.$oid).indexOf(user._id.$oid), 1);
      this.showToast(`You stopped following @${ user.username }`);
    } else {
      response = await provider.follow(user._id.$oid);

      this.following.push(user);
      this.showToast(`You are now following @${ user.username }`, 'success');
    }

    this.currentUser = response.user;
  }

  public theyFollow(user: User): boolean {
    return this.currentUser.follower_ids
      .map((follower: any) => follower.$oid)
      .includes(user._id.$oid);
  }

  public iFollow(user: User): boolean {
    return this.currentUser.following_ids
      .map((following: any) => following.$oid)
      .includes(user._id.$oid);
  }

  private async get(query?: string, event?: any) {
    const params = {}
          params['page'] = this.page += 1;

    if (false) {
      this.user = await this.userProvider.get('');
    } else {
      this.user = this.currentUser;
    }

    if (query) { params['q'] = query } else {
      this.followers = await this.userProvider.followers(this.user._id.$oid);
      this.following = await this.userProvider.following(this.user._id.$oid);
    }

    const response: UserResponse = await this.userProvider.load(params);
    this.total_users = response.total_users;

    if (response) {
      if (this.page === 1) {
        this.users = response.users;
      } else {
        response.users.forEach((user: User) => this.users.push(user));
      }

      if (event) {
        event.target.complete();

        // Disable the Infinite scroll event listeners
        //
        if ((event.type === 'ionInfinite') && (response.users.length === 0)) {
          this.infiniteScroll.disabled = true;
        }
      }
    } else {
      // TODO
    }
  }

  public search(event: any) {
    const value: string = event.target.value;

    this.filtering = true;
    this.page = 0;

    if (value && value.trim() != '') {
      this.get(value);
    } else {
      this.get();
      this.filtering = false;
    }
  }

  public refresh(event: any) {
    this.page = 0;
    this.get(null, event);
  }

  private async showToast(message: string, color: string = 'dark', duration: number = 1500) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: duration,
      color: color
    });

    toast.present();
  }
}