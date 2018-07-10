import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { normalizeURL } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { from } from 'rxjs/observable/from';

import { IonicPage, ViewController, ActionSheetController } from 'ionic-angular';

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

  colours: Array<any> = [];
  interests: Array<any> = [];

  imageChanges: Object = {};

  constructor(
    public sanitizer: DomSanitizer,
    public camera: Camera,
    public viewCtrl: ViewController,
    public actionSheetCtrl: ActionSheetController,
    public sessionProvider: SessionProvider,
    public userProvider: UserProvider,
    public metaProvider: MetaProvider,
    public imageProvider: ImageProvider
  
  ) { }

  ionViewDidLoad() { 
    this.getUserAndMeta()
  }

  private getUserAndMeta() {
    forkJoin([
      this.sessionProvider.user(),
      this.metaProvider.colours(),
      this.metaProvider.interests()
    
    ]).subscribe((response: Array<any>) => {
      this.user = response[0];
      this.colours = response[1];
      this.interests = response[2];

      this.generateForm();
    })
  }

  public showImageOptions(caller: string) {
    const buttons: Array<any> = [];

    buttons.push({
      text: 'Camera',
      handler: () => { this.captureImage('CAMERA', caller) }
    })
    
    buttons.push({
      text: 'Library',
      handler: () => { this.captureImage('LIBRARY', caller) }
    })

    buttons.push({
      text: 'Cancel',
      role: 'cancel'
    });

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Asset Actions',
      buttons: buttons
    });

    actionSheet.present();
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
    })
  }

  private captureImage(source: string, caller: string) {
    const options: CameraOptions = {
      
                 quality: 100,
        saveToPhotoAlbum: (source == 'CAMERA'),
               allowEdit: false,
      correctOrientation: true,
         destinationType: this.camera.DestinationType.FILE_URI,
              sourceType: (source == 'CAMERA' ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY),
            encodingType: this.camera.EncodingType.JPEG,
               mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((image: any) => {
      if (caller === 'avatar') {
        this.imageChanges['avatar'] = image;
        this.user.avatar_url = normalizeURL(image);
        this.form.controls.avatar_id = this.imageChanges['avatar_id'];
      } else {
        this.imageChanges['profile_banner'] = image;
        this.user.profile_banner_url = normalizeURL(image);
        this.form.controls.profile_banner_id = this.imageChanges['profile_banner_id'];
      }
    }, (error) => {
      console.error(error);

      if (error !== 'no image selected' || error !== 'No camera available') {
        console.error(error)
      }
    })
  }

  changeformColour(colour: string) {
    this.user.colour = colour;
    this.form.controls.colour.setValue(colour);
  }

  submit() {
    let batch: any[] = [];

    if (Object.keys(this.imageChanges).length > 0) {
      batch.push(this.processUploads())
    } else {
      batch.push(of(false))
    }

    forkJoin(batch).subscribe((response: Array<any>) => {
      const userChanges: any = Object.assign(this.form.value, response[0]);

      this.userProvider.update(this.user._id.$oid, userChanges).subscribe((response: any) => {
        if (response.status === 'ok') {
          this.dismissView(response.user)
        } else {
          console.log('error')
        }
      })
    })
  }

  private processUploads() {
    return Observable.create((observer) => {

      // Object.entries is fairly new and TS support requires you to enable experimentalDecorators
      // in order for TS not to error out.
      // As such, declare the object as: any until support in TS is added by default.
      // 
      const _obj: any = Object;

      let images: any[];
          images = _obj.entries(this.imageChanges)

      let counter: number = images.length;
      const userChanges: any = { };

      images.forEach(([key, value]) => {
        from(this.imageProvider.upload(value)).map((response) => JSON.parse(response.response)).subscribe((response: any) => {
          if (response.success) {
            userChanges[`${ key }_id`] = response.image.public_id;
            counter--;
          } else {
            console.log(response)
          }

          if (counter === 0) {
            observer.next(userChanges);
            observer.complete()
          }
        })
      })
    })
  }

  public dismissView(data?: { }) {
    this.viewCtrl.dismiss(data)
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