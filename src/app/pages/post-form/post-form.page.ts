import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NavParams, ActionSheetController, ModalController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { User } from 'src/app/interfaces/user';
import { Post } from 'src/app/interfaces/post';

import { PostProvider } from 'src/app/providers/post';
import { PreviewResponse } from 'src/app/interfaces/preview.response';

interface PostResponse {
  status: string,
  post: Post
}

enum Color {
  primary   = 'primary',
  secondary = 'secondary',
  tertiary  = 'tertiary',
  success   = 'success',
  warning   = 'warning',
  danger    = 'danger',
  dark      = 'dark',
  medium    = 'medium',
  light     = 'light'
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
  public previews: any[] = [];

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
      type: Color.light
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

  public async captureImage(source: string) {
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

  public showPreview(previews: PreviewResponse[]) {
    this.previews = Object.values(previews);
    // this.previews = [
    //   {
    //     description: "Venture building company that specialise in web and mobile app design & development 🤘 We’re available for new projects: design@appnroll.com",
    //     image: "https://cdn.dribbble.com/users/2003613/screenshots/6384623/appnroll_rwd_dongiving_4x.png",
    //     previewed: true,
    //     title: "App'n'roll",
    //     url: "https://dribbble.com/appnroll"
    //   },
    //   {
    //     description: "URL previews are a way of organizing the URLs in the textarea in such a way that the URL is visible in a more organized way to the user instead of a just plain link. The plain URL makes no sense most of the time because of the advent of",
    //     image: "http://blog.kiprosh.com/content/images/knowbuddy/249/original/URL_preview.png",
    //     previewed: true,
    //     title: "Using URL previews in your web apps using JavaScript",
    //     url: "https://blog.kiprosh.com/using-url-previews-in-your-web-apps-using-javascript/"
    //   }
    // ]
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
