import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IonicPage, ViewController, ActionSheetController, LoadingController, normalizeURL } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';

import { User } from '../../models/user';

import { SessionProvider } from '../../providers/session';
import { UserProvider } from '../../providers/user';
import { MetaProvider } from '../../providers/meta';
import { ImageProvider } from '../../providers/image';

@IonicPage()
@Component({
  selector: 'page-profile-form',
  templateUrl: 'profile-form.html',
})

export class ProfileFormPage {
  user: User;
  form: FormGroup;

  colors: Array<any> = [];
  interests: Array<any> = [];

  imageChanges: Object = {};

  loader: any;

  constructor(
    private camera: Camera,
    private viewCtrl: ViewController,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private sessionProvider: SessionProvider,
    private userProvider: UserProvider,
    private metaProvider: MetaProvider,
    private imageProvider: ImageProvider
  
  ) { }

  async ionViewDidLoad() {
    this.user = await this.sessionProvider.user();
    this.colors = await this.metaProvider.colors();
    this.interests = await this.metaProvider.interests();

    this.generateForm();
  }

  public async showImageOptions(caller: string) {
    const actionSheet = await this.actionSheetCtrl.create({
      title: 'Choose Image Source',
      buttons: [
        {
          text: 'Camera',
          handler: () => { this.captureImage('CAMERA', caller) }
        },
        {
          text: 'Library',
          handler: () => { this.captureImage('LIBRARY', caller) }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  private generateForm() {
    this.form = new FormGroup({
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
      password_confirmation: new FormControl(this.user.password_confirmation),

      avatar_id:         new FormControl(this.user.avatar_id),
      profile_banner_id: new FormControl(this.user.profile_banner_id)
    });
  }

  private async captureImage(source: string, caller: string) {
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
    
    if (caller === 'avatar') {
      this.imageChanges['avatar'] = image;
      this.user.avatar_url = normalizeURL(image);
      this.form.controls.avatar_id.setValue(this.imageChanges['avatar_id']);
    } else {
      this.imageChanges['profile_banner'] = image;
      this.user.profile_banner_url = normalizeURL(image);
      this.form.controls.profile_banner_id.setValue(this.imageChanges['profile_banner_id']);
    }
  }

  public changeformColor(color: string) {
    this.user.colour = color;
    this.form.controls.colour.setValue(color);
  }

  public async submit() {
    let imageResponse: any = { };

    await this.loading().present();

    if (Object.keys(this.imageChanges).length > 0) {
      imageResponse = await this.processUploads();
    }

    const response: any = await this.userProvider.update(this.user._id.$oid, Object.assign(this.form.value, imageResponse));

    if (response.status === 'ok') {
      this.loader.dismiss();
      this.dismissView(response.user);
    } else {
      console.log('error') 
    }
  }

  private async processUploads() {
    const userChanges: any = { };

    for (const [key, value] of Object.entries(this.imageChanges)) {
      const response: any = await this.imageProvider
        .upload(value)
        .then((response: any) => JSON.parse(response.response));

      if (response.success) {
        userChanges[`${ key }_id`] = response.image.public_id;
      } else {
        return false;
      }
    }

    return userChanges;
  }

  public async dismissView(data?: { }) {
    await this.viewCtrl.dismiss(data);
  }

  private loading() {
    this.loader = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: 'Please wait..'
    });

    return this.loader;
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