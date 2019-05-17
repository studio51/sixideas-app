import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NavParams, ActionSheetController, ModalController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { User } from 'src/app/interfaces/user';
import { Post } from 'src/app/interfaces/post';

import { PostProvider } from 'src/app/providers/post';

interface PostResponse {
  status: string,
  post: Post
}

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
  selector: 'app-post-form',
  templateUrl: './post-form.page.html',
  styleUrls: ['./post-form.page.scss'],
})

export class PostFormPage implements OnInit {
  @Input() user: User;
  @Input() post: Post;

  form: FormGroup;

  public colors: any = Color;

  // color: Color = Color.default;

  constructor(
    public camera: Camera,
    public params: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    public postProvider: PostProvider

  ) {
  }

  ngOnInit() {
    // this.user = this.params.get('user');
    const post: Post = new Post({
      title: '',
      body: '',
      type: Color.default
    });

    if (this.params.get('id')) {
      Object.assign(post, this.post);
    } else {
      this.post = post;
    }

    this.generateForm();
  }

  private generateForm() {
    this.form = new FormGroup({
      title: new FormControl(this.post.title),
      body: new FormControl(this.post.body, Validators.required),
      type: new FormControl(this.post.type, Validators.required)
    })
  }

  public async showImageOptions() {
    const actionSheet: any = await this.actionSheetCtrl.create({
      header: 'Choose Image Source',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => { this.captureImage('CAMERA') }
        },
        {
          text: 'Library',
          icon: 'camera',
          handler: () => { this.captureImage('LIBRARY') }
        },
        {
          text: 'Cancel',
          role: 'destructive'
        }
      ]
    });

    await actionSheet.present();
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

    console.log(image);
    // this.imageChange['image'] = image;
    // this.post.image_url = normalizeURL(image);
    // this.form.controls.image_id.setValue(this.imageChange['image_id']);
  }

  public changeType(color: string) {
    this.form.controls.type.setValue(Color[color]);
  }

  public async submit() {
    Object.assign(this.post, this.form.value);

    const response: PostResponse = await this.postProvider.updateOrCreate(this.post);

    if (response.status === 'ok') {
      this.dismiss(this.post);
    } else {
      // TODO
    }
  }

  public async dismiss(post?: Post) {
    await this.modalCtrl.dismiss(post);
  }
}
