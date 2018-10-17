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

import * as getURLs from 'get-urls';

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

  private captureImage(source: string) {
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
      this.imageChange['image'] = image;
      this.post.image_url = normalizeURL(image);
      this.form.controls.image_id.setValue(this.imageChange['image_id'])
    }, (error) => {
      console.error(error);

      if (error !== 'no image selected' || error !== 'No camera available') {
        console.error(error)
      }
    })
  }

  public async checkPostContent(event: any) {
    const value: string = event.value;

    if (event.type === 'keyup') {
      const moveOn: boolean = (event.code === 'Space' || event.key === ' ');
      const ignoredChar: boolean = event.key === 'Shift' || event.key === 'Backspace';

      if (moveOn) {
        this.record = false;
        this.query = '';

        this.users = this.tags = [];

        return
      }

      if (event.key.startsWith('@')) {
        this.record = true;
        this.query = '@';
      }

      if (this.record && this.query.startsWith('@') && this.query.length > 0) {
        if (event.code === 'Backspace') {
          this.query = this.query.slice(0, -1);
          this.users = await this.userProvider.load(this.query);
        } else {
          if (!ignoredChar) {
            this.query += event.key;
            this.users = await this.userProvider.load(this.query);
          }
        }
      }

      if (event.key.startsWith('#')) {
        this.record = true;
        this.query = '#';
      }

      if (this.record && this.query.startsWith('#') && this.query.length > 0) {
        if (event.code === 'Backspace') {
          this.query = this.query.slice(0, -1);
          this.tags = await this.tagProvider.load(this.query);
        } else {
          if (!ignoredChar) {
            this.query += event.key;
            this.tags = await this.tagProvider.load(this.query);
          }
        }
      }
    } else if (event.type === 'text') {
      const URLs: Set<any> = getURLs(value);

      // Check and see if there are any URLs in the string for us to check. Also,
      // really important, check to make sure we haven't already created a preview for it.
      // 
      if (URLs.size > 0 && !this.preview) {
        console.log(URLs)
        // @ts-ignore
        const previewURL: string = URLs.entries().next().value[0];
        const response: any = await this.postProvider.preview(previewURL);

        if (response) {
          this.preview = response;
          return
        }

        throw new Error('request failed');
      } else if ( URLs.size === 0) { this.preview = null }

      return
    } else {
      return
    }
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

  public dismissView(post?: Post) {
    this.viewCtrl.dismiss(post)
  }

  public replaceText(value: string) {
    const body: any = this.form.controls.body;
    
    if (this.query.startsWith('@')) {
      body.setValue(body.value.replace(this.query.replace('@@', '@'), `@${ value }`));
    } else {
      body.setValue(body.value.replace(this.query.replace('##', '#'), value));
    }

    this.query = '';
  }
}
