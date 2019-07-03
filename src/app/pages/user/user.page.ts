import { Component, OnInit, Input } from '@angular/core';

import { NavController, ModalController, ActionSheetController } from '@ionic/angular';

import { Router } from '@angular/router';

import { SessionProvider } from 'src/app/providers/session';
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
  @Input() id: string;
  @Input() user: User;

  currentUser: User;

  tags: Tag[];
  posts: Post[];

  caller: string;
  processingImage: boolean = false;

  constructor(
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public sessionProvider: SessionProvider,
    public userProvider: UserProvider,
    public postProvider: PostProvider,
    public userEditPageProvider: UserEditPage,

    public navCtrl: NavController,
    public router: Router

  ) { }

  async ngOnInit() {
    this.currentUser = await this.sessionProvider.current();

    this.get();
  }

  public async get() {
    if (!this.user && this.id) {
      this.user = await this.userProvider.get(this.id);
    } else {
      this.user = this.currentUser;
    }

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

  public viewTaggedPosts(tag: Tag) {
    this.dismiss();
    this.router.navigate(['/tabs/feed', { tag: tag.text }]);
  }

  public async dismiss(event?: any) {
    return await this.modalCtrl.dismiss();
  }

  get owner(): boolean {
    return this.user._id.$oid === this.currentUser._id.$oid;
  }
}
