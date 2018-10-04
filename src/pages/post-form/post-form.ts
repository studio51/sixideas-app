import { Component, Renderer } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { from } from 'rxjs/observable/from';

import { IonicPage, ViewController, NavParams, ActionSheetController, normalizeURL } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { User } from '../../models/user';
import { Post } from '../../models/post';

import { SessionProvider } from '../../providers/session';
import { PostProvider } from '../../providers/post';
import { ImageProvider } from '../../providers/image';

@IonicPage()
@Component({
  selector: 'page-post-form',
  templateUrl: 'post-form.html'
})

export class PostFormPage {
  postID: string;

  user: User;
  post: Post;
  form: FormGroup;

  postTypes: Array<any> = [];
  imageChange: Object = {};

  constructor(
    public renderer: Renderer,
    public camera: Camera,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public sessionProvider: SessionProvider,
    public postProvider: PostProvider,
    public imageProvider: ImageProvider
  
  ) {

    this.postTypes = ['default', 'info', 'success', 'danger', 'warning'];

    this.post = new Post({});
    this.postID = navParams.get('id');
  }

  async ionViewDidLoad() {
    this.user = await this.sessionProvider.user();
    (this.postID ? this.edit() : this.generateForm());
  }

  private edit() {
    const response = this.postProvider.get(this.postID)
    Object.assign(this.post, response);
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

  public showImageOptions() {
    const buttons: Array<any> = [];

    buttons.push({
      text: 'Camera',
      handler: () => { this.captureImage('CAMERA') }
    })
    
    buttons.push({
      text: 'Library',
      handler: () => { this.captureImage('LIBRARY') }
    })

    buttons.push({
      text: 'Cancel',
      role: 'cancel'
    });

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Choose Image Source',
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

  public checkPostContent(event: any) {
    console.log(event)
    const expression: string = 'https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)';
    const regex: RegExp = new RegExp(expression);

  }

  public submit() {
    let batch: any[] = [];
    let subscriber: any;

    if (Object.keys(this.imageChange).length > 0) {
      batch.push(this.processUpload())
    } else {
      batch.push(of(false))
    }

    forkJoin(batch).subscribe((response: Array<any>) => {
      const postChanges: any = Object.assign(this.form.value, response[0]);

      if (this.postID) {
        subscriber = this.postProvider.update(this.postID, postChanges)
      } else {
        subscriber = this.postProvider.create(postChanges)
      }

      subscriber.subscribe((response: any) => {
        console.log(response)
        if (response.status === 'ok') {
          this.dismissView(response.post)
        } else {
          console.log('error')
        }
      })
    })
  }

  private processUpload() {
    return Observable.create((observer) => {
    
      from(this.imageProvider.upload(this.imageChange['image'])).map((response) => JSON.parse(response.response)).subscribe((response: any) => {
        if (response.success) {
          observer.next({ image_id: response.image._id.$oid });
          observer.complete();
        } else {
          console.log(response)
        }
      })
    })
  }

  public dismissView(post?: Post) {
    this.viewCtrl.dismiss(post)
  }
}
