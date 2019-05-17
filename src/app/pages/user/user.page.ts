import { Component, OnInit } from '@angular/core';

import { NavParams, ModalController, ActionSheetController } from '@ionic/angular';

import { UserProvider } from 'src/app/providers/user';
import { PostProvider } from 'src/app/providers/post';

import { UserEditPage } from 'src/app/pages/user-edit/user-edit.page';

import { User } from 'src/app/interfaces/user';
import { Tag } from 'src/app/interfaces/tag';
import { Post } from 'src/app/interfaces/post';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  providers: [UserEditPage]
})

export class UserPage implements OnInit {
  user: User;
  currentUser: User;

  tags: Tag[];
  posts: Post[];

  caller: string;
  processingImage: boolean = false;

  constructor(
    // public params: NavParams,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public userProvider: UserProvider,
    public postProvider: PostProvider,
    public userEditPageProvider: UserEditPage

  ) { }

  async ngOnInit() {
    this.currentUser = await this.userProvider.current();
    this.get();
  }

  public async get() {
    const params: Object = {}
    // const username: string = this.params.get('username');

    // if (username) {
    //   params['username'] =  username
    // }
    this.user = await this.userProvider.current();

    // if (this.params.get('id') || username) {
      // this.user = await this.userProvider.get(this.params.get('id'), params);
    // } else {
      // this.user = this.currentUser;
    // }

    this.tags = await this.userProvider.tags(this.user._id.$oid);
    this.posts = await this.postProvider.load(this.user._id.$oid);
  }

  public async showProfileOptions(caller: string) {
    this.caller = caller;

    const actionSheet = await this.actionSheetCtrl.create({
      translucent: true,
      cssClass: 'user-action-sheet',
      buttons: [
        {
          text: 'Take new Photo',
          icon: 'camera',
          handler: () => {
            this.processImageChanges('CAMERA');
          }
        }, {
          text: 'Select Photo from Library',
          icon: 'images',
          handler: () => {
            this.processImageChanges('LIBRARY');
          }
        }, {
          text: 'Change Colour',
          icon: 'color-palette',
          handler: () => {
            // TODO
          }
        }
      ]
    });

    await actionSheet.present();
  }

  private async processImageChanges(source: string) {

    // Get Image returned by the Camera plugin. Returns the original and resolved path.
    //
    const { original, resolved } = await this.userEditPageProvider.captureImage(source, this.caller);

    // Set the Banner or Avatar accordingly
    //
    this.user[`${ this.caller }_url`] = resolved;
    this.processingImage = true;

    // Upload the Image
    //
    const upload: any = await this.userEditPageProvider.processImage(original);

    if (upload.responseCode === 200) {
      const image: any = JSON.parse(upload.response).image;
      const changes: any = {};
            changes[`${ this.caller }_id`] = image.public_id;

      // Update the User
      //
      const update: any = await this.userProvider.update(this.user._id.$oid, new User(changes));
      
      if (update.status === 'updated') {
        // TODO
      } else {
        // TODO
      }
    }

    this.processingImage = false;
  }

  public async dismiss(event?: any) {
    return await this.modalCtrl.dismiss();
  }

  get owner(): boolean {
    return this.user._id.$oid === this.currentUser._id.$oid;
  }
}
