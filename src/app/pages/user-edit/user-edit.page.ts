import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';

import { ActionSheetController, ModalController, LoadingController } from '@ionic/angular';

import { User } from 'src/app/interfaces/user';
import { Post } from 'src/app/interfaces/post';

import { UserProvider } from 'src/app/providers/user';
import { ImageProvider } from 'src/app/providers/image';

enum Color {
  default   = 'default',
  primary   = 'primary',
  secondary = 'secondary',
  tertiary  = 'tertiary',
  success   = 'success',
  warning   = 'warning',
  danger    = 'danger',
  dark      = 'dark',
  medium    = 'medium'
}

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.page.html',
  styleUrls: ['./user-edit.page.scss'],
})

export class UserEditPage implements OnInit {
  user: User;
  post: Post;

  form: FormGroup;

  public colors: any = Color;

  caller: string;
  processingImage: boolean = false;

  constructor(
    public camera: Camera,
    public webview: WebView,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public userProvider: UserProvider,
    public imageProvider: ImageProvider

  ) { }

  async ngOnInit() {
    this.user = new User(await this.userProvider.current());
    this.generateForm();

    this.form.valueChanges.subscribe((changes: any) => {
      this.user = Object.assign(this.user, changes);
    });
  }

  private generateForm() {
    this.form = new FormGroup({
      colour:    new FormControl(this.user.colour),

      username:  new FormControl({
        value: this.user.username,
        disabled: true
      }, Validators.required),

      forename:  new FormControl(this.user.forename),
      surname:   new FormControl(this.user.surname),
      bio:       new FormControl(this.user.bio),
      email:     new FormControl(this.user.email, Validators.required),

      interests: new FormControl(this.user.interests, Validators.required),

      password:  new FormControl(this.user.password),
      password_confirmation: new FormControl(this.user.password_confirmation, Validators.required),
    });
  }

  public changeType(color: string) {
    this.form.controls.colour.setValue(Color[color]);
  }

  public async showImageOptions(caller: string) {
    this.caller = caller;

    const actionSheet = await this.actionSheetCtrl.create({
      translucent: true,
      cssClass: 'user-edit-action-sheet',
      buttons: [{
        text: 'Camera',
        icon: 'camera',

        handler: () => {
          this.processImageChanges('CAMERA');
        }
      }, {
        text: 'Library',
        icon: 'images',

        handler: () => {
          this.processImageChanges('LIBRARY');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel'
      }]
    });

    await actionSheet.present();
  }

  public async captureImage(source: string, caller: string) {
    const options: CameraOptions = {

                 quality: 100,
        saveToPhotoAlbum: (source === 'CAMERA'),
               allowEdit: false,
      correctOrientation: true,
         destinationType: this.camera.DestinationType.FILE_URI,
              sourceType: (source === 'CAMERA' ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY),
            encodingType: this.camera.EncodingType.JPEG,
               mediaType: this.camera.MediaType.PICTURE
    }

    const image: any = await this.camera.getPicture(options);

    return {
      original: image,
      resolved: this.webview.convertFileSrc(image)
    };
  }

  private async processImageChanges(source: string) {

    // Get Image returned by the Camera plugin. Returns the original and resolved path.
    //
    const { original, resolved } = await this.captureImage(source, this.caller);

    // Set the Banner or Avatar accordingly
    //
    this.user[`${ this.caller }_url`] = resolved;
    this.processingImage = true;

    // Upload the Image
    //
    const upload: any = await this.processImage(original);

    if (upload.responseCode === 200) {
      const image: any = JSON.parse(upload.response).image;
      this.form.controls[`${ this.caller }_id`].setValue(image._id.$oid);
    }

    this.processingImage = false;
  }

  // ngOnDestroy() {
  //   this.formChangesSubscription.unsubscribe();
  // }

  public async submit() {
    await this.userProvider.update(this.user._id.$oid, this.form.value);
    // this.loading.dismiss();
    this.dismiss(this.form.value);
  }

  public async dismiss(changes?: User) {
    await this.modalCtrl.dismiss(changes);
  }

  public async processImage(image: any) {
    const result: any = await this.imageProvider.upload(image)
    return result;
  }
}