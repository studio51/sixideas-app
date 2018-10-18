import { Component, Renderer } from '@angular/core';
import { IonicPage, ViewController, NavParams, ActionSheetController, normalizeURL } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Post } from '../../models/post';
import { User } from '../../models/user';
// import { Tag } from '../../models/tag';

import { SessionProvider } from '../../providers/session';
import { PostProvider } from '../../providers/post';
import { UserProvider } from '../../providers/user';
import { TagProvider } from '../../providers/tag';
import { ImageProvider } from '../../providers/image';

@IonicPage()
@Component({
  selector: 'page-post-form',
  templateUrl: 'post-form.html'
})

export class PostFormPage {
  postID: string;

  post: Post;
  user: User;

  users: User[];
  tags: any[];

  form: FormGroup;

  postTypes: Array<any> = [];
  imageChange: Object = {};

  preview: any;

  record: boolean = false;
  query: string = '';

  public postColor: any = {
    default: 'white',
    info: 'blue',
    success: 'green',
    warning: 'yellow',
    danger: 'red'
  }

  constructor(
    public renderer: Renderer,
    public camera: Camera,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public sessionProvider: SessionProvider,
    public postProvider: PostProvider,
    public userProvider: UserProvider,
    public tagProvider: TagProvider,
    public imageProvider: ImageProvider
  
  ) {

    this.postTypes = Object.keys(this.postColor);

    this.post = new Post({});
    this.postID = navParams.get('id');
  }

  async ionViewDidLoad() {
    this.user = await this.sessionProvider.user();
    (this.postID ? this.edit() : this.generateForm());
  }

  private async edit() {
    Object.assign(this.post, await this.postProvider.get(this.postID));
    this.generateForm();
  }

  private generateForm() {
    this.form = new FormGroup({
      title: new FormControl(this.post.title),
      body:  new FormControl(this.post.body, Validators.required),
      type:  new FormControl((this.post.type || this.postTypes[0])),
      
      image_id: new FormControl(this.post.image_id)
    })
  }

  public changeFormType(type: string) {
    this.form.controls.type.setValue(type)
  }

  public async showImageOptions() {
    const options: any = {
      title: 'Choose Image Source',
      buttons: [
        {
          text: 'Camera',
          handler: () => { this.captureImage('CAMERA') }
        },
        {
          text: 'Library',
          handler: () => { this.captureImage('LIBRARY') }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }

    await this.actionSheetCtrl
      .create(options)
      .present();
  }

  private async captureImage(source: string) {
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

    const image: any = await this.camera.getPicture(options);

    this.imageChange['image'] = image;
    this.post.image_url = normalizeURL(image);
    this.form.controls.image_id.setValue(this.imageChange['image_id']);
  }

  public async submit() {
    let post: any, image: any, response: any;

    // if (Object.keys(this.imageChange).length > 0) {
    //   image = await this.imageProvider.upload(this.imageChange['image']);
    //   post = Object.assign(this.form.value, {
    //     image_id: JSON.parse(image.response).image._id.$oid
    //   })
    // }

    if (this.postID) {
      response = await this.postProvider.update(this.postID, post)
    } else {
      response = await this.postProvider.create(post)
    }

    console.log(response)
    if (response.status === 'ok') {
      this.dismissView(response.post)
    } else {
      console.log('error')
    }
  }

  public async dismissView(post?: Post) {
    await this.viewCtrl.dismiss(post)
  }
}
