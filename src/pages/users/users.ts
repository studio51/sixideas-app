import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

import { SixIdeasApp } from '../../app/app.component';

import { User } from '../../models/user';
import { UserProvider } from '../../providers/user';
import { SessionProvider } from '../../providers/session';

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
  providers: [SixIdeasApp]
})

export class UsersPage {
  public currentUser: User;

  users: User[];
  qUsers: User[] = [];

  params: any;

  constructor(
    public app: SixIdeasApp,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private userProvider: UserProvider,
    private sessionProvider: SessionProvider

  ) { }

  ionViewDidEnter() {
    this.get();
  }

  public search(event: any) {
    this.users = this.qUsers;

    const value: string = event.target.value;

    if (value && value.trim() != '') {
      this.users = this.users.filter((user: User) => {
        return (
          this.filter(user.email, value),
          this.filter(user.username, value),
          this.filter(user.name, value)
        );
      });
    }
  }

  public async dismissView() {
    await this.viewCtrl.dismiss();
  }

  private async get() {
    this.currentUser = await this.sessionProvider.user();

    if (this.navParams.get('id')) {
      const user: User[] = await this.userProvider.get(this.navParams.get('id'), {
        include: this.navParams.get('want')
      });

      // @ts-ignore
      this.users = this.qUsers = user[this.navParams.get('want')];
    } else {
      this.users = this.qUsers = await this.userProvider.load();
    }
  }

  private filter(query: string, value: string) {
    return query.toLowerCase().indexOf(value.toLowerCase()) > -1;
  }
}