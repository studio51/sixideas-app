import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Camera, CameraOptions } from '@ionic-native/camera';

import { User } from '../../models/user';
import { Post } from '../../models/post';

@IonicPage()
@Component({
  selector: 'page-community',
  templateUrl: 'community.html',
})

export class CommunityPage {
  @ViewChild('postFormTitle') postFormTitle: ElementRef;
  @ViewChild('postFormImageOptions') postFormImageOptions: ElementRef;

  currentUser: User;
  posts: Post[] = [];

  newPostFormIsActive: boolean = false;
 
  drawerOptions: any;

  postColours: Array<{
    name: string,
    hex: string 
  }>;

  postForm: FormGroup;
  commentForm: FormGroup;

  constructor(
    public camera: Camera,
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController
  
  ) {

    this.drawerOptions = {
      handleHeight: 50,
      thresholdFromBottom: 200,
      thresholdFromTop: 200,
      bounceBack: true
    };
 
    this.postColours = [
      { name: 'Default', hex: '#ffffff' },
      { name: 'Blue',    hex: '#007bff' },
      { name: 'Green',   hex: '#28a745' },
      { name: 'Yellow',  hex: '#ffc107' },
      { name: 'Red',     hex: '#dc3545' }
    ]

    this.currentUser = {
      id: 2,
      name: "Vlad Radulescu",
      background: "https://res.cloudinary.com/dwvwdhzvg/image/upload/c_fill,h_270,w_1440/nciqyiykd7fya5c9ul0d",
      avatar: "https://randomuser.me/api/portraits/lego/6.jpg",
      colour: "#195097",
      tag: "@pacMakaveli",
      bio: "",
      following: [],
      followers: [{ id: 1 }, { id: 3 }],
      likes: [],
      interests: [
        { name: 'Design' },
        { name: 'Graphics' },
        { name: 'Technology' },
        { name: 'Health' },
        { name: 'EducatingTheFuture' },
        { name: 'BookClub' }
      ],
      online: true
    }

    const posts = [
      {
        id: 1,
        title: "",
        body: "Hello World! Let's start with explicitly saying that what you see is not what you get, in terms of UI. The MVP, which you are now browsing, is using default Ionic elements that might not match the web version. The UI will change drastically, in places, once the functionality is in.",
        author: {
          id: 2,
          name: "Vlad Radulescu",
          avatar: "https://randomuser.me/api/portraits/lego/6.jpg",
          colour: "#195097"
        },
        comments: [
          {
            id: 1,
            body: "This is a Comment",
            author: {
              id: 2,
              name: "Vlad Radulescu",
              avatar: "https://randomuser.me/api/portraits/lego/6.jpg",
              colour: "#195097"
            },
            likes_count: 2
          },
          {
            id: 2,
            body: "This is another Comment. But unlike the first one, this one spans across multiple rows.",
            author: {
              id: 2,
              name: "Vlad Radulescu",
              avatar: "https://randomuser.me/api/portraits/lego/6.jpg",
              colour: "#195097"
            },
            likes_count: 0
          },
          {
            id: 3,
            body: "Foo Bar Daz",
            author: {
              id: 3,
              name: "Richard Adams",
              avatar: "https://randomuser.me/api/portraits/lego/7.jpg",
              colour: "#195097"
            },
            likes_count: 0
          }
        ],
        created_at: "",
        likes_count: 3
      },
      {
        id: 2,
        title: "Did you know?",
        body: "Just because there's no backend, doesn't mean you can't leave comments! Go on, try it now :) ( they will not persist )",
        author: {
          id: 2,
          name: "Vlad Radulescu",
          avatar: "https://randomuser.me/api/portraits/lego/6.jpg",
          colour: "#195097"
        },
        comments: [],
        created_at: "",
        likes_count: 3
      },
      {
        id: 3,
        title: "",
        body: "@usable a quick poll reveals that most of the users access the community via a mobile app and are on iphones. Interestingly, the android users also use the desktop...and a couple have both iphone and android/ windows. I think it is going to be important to have the iphone version mobile to keep the levels of engagement up...particularly with badge icon notification.",
        author: {
          id: 3,
          name: "Richard Adams",
          avatar: "https://randomuser.me/api/portraits/lego/7.jpg",
          colour: "#195097"
        },
        comments: [],
        created_at: "",
        likes_count: 3
      },
      {
        id: 4,
        title: "",
        body: "Look at me! I'm blue(ish)",
        background: '#007bff',
        author: {
          id: 3,
          name: "Richard Adams",
          avatar: "https://randomuser.me/api/portraits/lego/7.jpg",
          colour: "#195097"
        },
        comments: [],
        created_at: "",
        likes_count: 3
      },
    ];

    for (let post of posts) {
      this.posts.push(new Post(post));
    }

    this.postForm = new FormGroup({
      body: new FormControl('', Validators.required),

      title:  new FormControl(),
      colour: new FormControl(),
      cover:  new FormControl()
    })

    this.commentForm = new FormGroup({
      body: new FormControl('', Validators.required)
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunityPage');
  }

  showNewFormPost() {
    this.newPostFormIsActive = true;
  }

  likePost(postID: number) {
    const post = this.posts.find((post: Post) => post.id === postID);
          
          post.likes_count = post.likes_count + 1;
  }

  likeComment(postID: number, commentID: number) {
    const post = this.posts.find((post: Post) => post.id === postID),
          comment: any = post.comments.find((comment: any) => comment.id === commentID);

          comment.likes_count = comment.likes_count + 1;
  }

  changePostFormColour(colourHEX: any) {
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
    const post: any = {}; //new Post();

          post.title  = this.postForm.value.title;
          post.body   = this.postForm.value.body;
          post.colour = this.postForm.value.colour;
          post.author = this.currentUser;

    this.posts.push(post)
  }

  addComment(postID: number) {    
    const comment: any = {};
          comment.body = this.commentForm.value.body;
          comment.author = this.currentUser;

    const post = this.posts.find((post: Post) => post.id === postID);
      console.log(post)

          post.comments.push(comment)

  }
}
