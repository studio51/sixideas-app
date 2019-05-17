import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';

import { User } from 'src/app/interfaces/user';
import { Post } from 'src/app/interfaces/post';
import { Tag } from 'src/app/interfaces/tag';

import { PostProvider } from 'src/app/providers/post';
import { TagProvider } from 'src/app/providers/tag';
import { UserProvider } from 'src/app/providers/user';

import { PostFormPage } from '../post-form/post-form.page';
import { TagsPage } from '../tags/tags.page';

import * as Sugar from 'sugar/string';

Sugar.Array.extend({
  methods: ['last']
});

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})

export class FeedPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  user: User;
  tags: Tag[];

  posts: Post[] = [];

  filtering: boolean = false;
  selectedTag: Tag = null;

  private page: number = 0;

  constructor(
    public modalCtrl: ModalController,
    public postProvider: PostProvider,
    public tagProvider: TagProvider,
    public userProvider: UserProvider

  ) { }

  async ngOnInit() {
    this.user = await this.userProvider.current();

    this.getTags();
    this.get();
  }

  public async getTags() {
    const response = await this.userProvider.tags(this.user._id.$oid);

    if (response) {
      this.tags = response;
    } else {
      // TODO
    }
  }

  public async get(event?: any) {
    const params = {}
          params['include_author'] = true;
          params['page'] = this.page += 1;

    if (this.selectedTag) { params['tag'] = this.selectedTag }

    const response = await this.postProvider.load(null, params);

    if (response) {
      if (this.page === 1) {
        this.posts = response;
      } else {
        response.forEach((post: Post) => this.posts.push(post));
      }

      if (this.filtering) {
        this.filtering = !this.filtering;
      }

      if (event) {
        event.target.complete();

        // Disable the Infinite scroll event listeners
        //
        if ((event.type === 'ionInfinite') && (response.length === 0)) {
          this.infiniteScroll.disabled = true;
        }
      }
    } else {
      // TODO
    }
  }

  public async newPostForm() {
    const modal: any = await this.modalCtrl.create({
      component: PostFormPage,
      componentProps: {
        user: this.user
      }
    });

     await modal.present();
  }

  public async showTagsPage() {
    const modal: any = await this.modalCtrl.create({
      component: TagsPage,
      componentProps: {
        user: this.user,
        userTags: this.tags
      }
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.filter(data);
    }
  }

  public refresh(event: any) {
    this.page = 0;
    this.get(event);
  }

  public filter(tag: Tag) {
    this.page        = 0;
    this.filtering   = true;
    this.selectedTag = tag;

    this.get();
  }
}
