import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { IonicPage, ViewController, NavParams, ActionSheetController } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { User } from '../../models/user';
import { Post } from '../../models/post';

import { SessionProvider } from '../../providers/session';
import { PostProvider } from '../../providers/post';

@IonicPage()
@Component({
  selector: 'page-post-form',
  templateUrl: 'post-form.html'
})

export class PostFormPage {
  @ViewChild('postImageOptions') postImageOptions: ElementRef;
  @ViewChild('postTitle') postTitle: ElementRef;

  postID: string;

  user: User;
  post: Post;
  form: FormGroup;

  postTypes: Array<any> = [];

  constructor(
    public renderer: Renderer,
    public camera: Camera,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public sessionProvider: SessionProvider,
    public postProvider: PostProvider
  
  ) {

    this.postTypes = ['default', 'info', 'success', 'danger', 'warning'];

    this.post = new Post({});
    this.postID = navParams.get('id');
  }

  ionViewDidLoad() {
    this.sessionProvider.user().subscribe((user: User) => {
      this.user = user;
      (this.postID ? this.edit() : this.generateForm());
    })
  }

  private new() { }

  private edit() {
    this.postProvider.get(this.postID).subscribe((response: any) => {
      Object.assign(this.post, response);
      this.generateForm();
    })
  }

  private generateForm() {
    this.form = new FormGroup({
      title: new FormControl(this.post.title),
      body:  new FormControl(this.post.body, Validators.required),
      type:  new FormControl((this.post.type || this.postTypes[0])),

      image: new FormGroup({
        file: new FormControl()
      })
    })
  }

  public changeFormType(type: string) {
    this.form.controls.type.setValue(type)
  }

  public showImageOptions() {
    const buttons: Array<any> = [];

    buttons.push({
      text: 'Camera',
      handler: () => { this.captureImage('CAMERA') }
    })
    
    buttons.push({
      text: 'Library',
      handler: () => { this.captureImage('Library') }
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

    this.camera.getPicture(options).then((image) => {
      this.form.controls.cover.setValue(image);
    }, (error) => {
      console.error(error);

      if (error !== 'no image selected' || error !== 'No camera available') {
        console.error(error)
      }
    })
  }

  public submit() {
    let subscriber: any;

    if (this.postID) {
      subscriber = this.postProvider.update(this.postID, this.form.value)
    } else {
      subscriber = this.postProvider.create(this.form.value)
    }

    subscriber.subscribe((response: any) => {
      if (response.status === 'ok') {
        this.dismissView(response.post)
      } else {
        console.log('error')
      }
    })
  }

  public dismissView(post?: Post) {
    this.viewCtrl.dismiss(post)
  }
}
