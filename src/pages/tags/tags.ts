import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { StatusBar } from '@ionic-native/status-bar';

import { IonicPage, NavParams, ViewController } from 'ionic-angular';

import { TagProvider } from '../../providers/tag';

@IonicPage()
@Component({
  selector: 'page-tags',
  templateUrl: 'tags.html',
})

export class TagsPage {
  public searchControl: any = new FormControl('');

  tag: string;
  tags: any[];
  qTags: any[] = [];

  constructor(
    private statusBar: StatusBar,
    navParams: NavParams,
    public viewCtrl: ViewController,
    public tagProvider: TagProvider
  
  ) {
    statusBar.styleDefault();

    // if (navParams.get('tag')) {
    //   this.tag = navParams.get('tag').replace('#', '')
    // }
  }

  ionViewDidEnter() {
    this.get();
  }

  private async get() {
    this.tags = this.qTags = await this.tagProvider.load();
  }

  public search(event) {
    this.tags = this.qTags;

    const value = event.target.value.replace(/^#/, '');

    if (value && value.trim() != '') {
      this.tags = this.tags.filter((tag: any) => {
        return (tag.text.toLowerCase().indexOf(value.toLowerCase()) > -1)
      })
    }
  }

  public async dismissView(data?: { }) {
    await this.statusBar.styleLightContent();
    await this.viewCtrl.dismiss(data);
  }
}
