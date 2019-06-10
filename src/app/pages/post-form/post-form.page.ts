import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NavParams, ActionSheetController, ModalController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';

import { User } from 'src/app/interfaces/user';
import { Color, Post } from 'src/app/interfaces/post';

import { UploadProvider, UploadResponse } from 'src/app/providers/upload';
import { PostProvider } from 'src/app/providers/post';
import { PreviewResponse } from 'src/app/interfaces/preview.response';

interface PostResponse {
  status: string,
  post: Post
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
  public urlPreviews: any[] = [];

  public processingUpload: boolean = false;

  constructor(
    public camera: Camera,
    public webview: WebView,
    public params: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    public uploadProvider: UploadProvider,
    public postProvider: PostProvider

  ) { }

  ngOnInit() {
    this.post = Object.assign(new Post(), this.post);
    this.generateForm();

    console.log(this.colors)
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

    this.processingUpload = true;
    const image: string = await this.camera.getPicture(options);

    try {
      if (image) {
        const upload: any = await this.uploadProvider.upload(image), // FileUploadResult
              response: UploadResponse = JSON.parse(upload.response);

        console.log('upload', upload);
        console.log('response', response);

        this.post.image_url = this.webview.convertFileSrc(image);

        console.log(this.webview.convertFileSrc(image));

        if (response.status === 'created') {
          this.form.controls.image_id.setValue(response.image._id.$oid);
        }
      }
    } catch(e) {
      console.log('There was a problem')
    }

    this.processingUpload = false;
  }

  public showURLPreview(previews: PreviewResponse[]) {
    this.urlPreviews = Object.values(previews);
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
