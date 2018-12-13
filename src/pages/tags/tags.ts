import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { StatusBar } from '@ionic-native/status-bar';

import { IonicPage, ViewController } from 'ionic-angular';

import { TagProvider } from '../../providers/tag';

@IonicPage()
@Component({
  selector: 'page-tags',
  templateUrl: 'tags.html',
})

export class TagsPage {
  @ViewChild('searchBar') searchBar: any;

  public searchControl: any = new FormControl('');

  tags: any[];
  qTags: any[] = [];

  constructor(
    private statusBar: StatusBar,
    public viewCtrl: ViewController,
    public tagProvider: TagProvider
  
  ) {

    statusBar.styleDefault();
  }

  ionViewDidEnter() {
    this.get();

    setTimeout(() => {
      this.searchBar.setFocus();
    }, 10);
  }

  private async get() {
    this.tags = this.qTags = await this.tagProvider.load();
  }

  public search(event: any) {
    this.tags = this.qTags;

    let value: string = '';

    if (event.target && event.target.value) {
      value = event.target.value.replace(/^#/, '');
    }

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
