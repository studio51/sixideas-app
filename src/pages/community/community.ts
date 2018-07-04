import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Camera, CameraOptions } from '@ionic-native/camera';

import { User } from '../../models/user';
import { Post } from '../../models/post';

import { UserProvider } from '../../providers/user';
import { PostProvider } from '../../providers/post';

@IonicPage()
@Component({
  selector: 'page-community',
  templateUrl: 'community.html',
})

export class CommunityPage {
  @ViewChild('postFormTitle') postFormTitle: ElementRef;
  @ViewChild('postFormImageOptions') postFormImageOptions: ElementRef;

  user: User;
  posts: Post[] = [];

  newPostFormIsActive: boolean = false;
 
  postColours: Array<{
    name: string,
    hex: string 
  }>;

  postForm: FormGroup;

  constructor(
    public camera: Camera,
    // public navCtrl: NavController,
    // public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public userProvider: UserProvider,
    public postProvider: PostProvider
  
  ) {

    this.postColours = [
      { name: 'Default', hex: '#ffffff' },
      { name: 'Blue',    hex: '#007bff' },
      { name: 'Green',   hex: '#28a745' },
      { name: 'Yellow',  hex: '#ffc107' },
      { name: 'Red',     hex: '#dc3545' }
    ]

    this.postForm = new FormGroup({
      body: new FormControl('', Validators.required),

      title:  new FormControl(),
      colour: new FormControl(),
      cover:  new FormControl()
    })
  }

  ionViewDidEnter() {
    this.userProvider.get('5b374f7f96e80db323df2942').subscribe((user: User) => {
      this.user = user;
      this.getPosts();
    })
  }

  private getPosts() {
    this.postProvider.load('', { include_author: true }).subscribe((posts: Post[]) => {
      this.posts = posts
    })
  }

  showNewPostForm() {
    this.newPostFormIsActive = true;
  }

  changePostFormColour(colourHEX: any) {
    let a: any = this.postFormTitle;

    if (colourHEX === "#ffffff") {
      a.setElementStyle('display', 'block')
    } else {
      a.setElementStyle('display', 'none')
    }

    this.postForm.controls.colour.setValue(colourHEX)
  }

  showPostFormImageOptions() {
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
      this.postForm.controls.cover.setValue(image);
    }, (error) => {
      console.info('');
      console.error(error);

      if (error !== 'no image selected' || error !== 'No camera available') {
        console.error(error)
      }
    })
  }

  addPost() {
    console.log(this.postForm)

    const post: any = {}; //new Post();

          post.title  = this.postForm.value.title;
          post.body   = this.postForm.value.body;
          post.background = this.postForm.value.colour;

    this.posts.push(post);
    this.postForm.reset();
    this.newPostFormIsActive = false;
  }
}
