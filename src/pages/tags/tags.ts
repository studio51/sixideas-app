import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

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
  tags: any[] = [];
  qTags: any[] = [];

  noResultsQuery: boolean = false;

  constructor(
    navParams: NavParams,
    public viewCtrl: ViewController,
    public tagProvider: TagProvider
  
  ) {

    if (navParams.get('tag')) {
      this.tag = navParams.get('tag').replace('#', '')
    }
  }

  ionViewDidEnter() {
    this.getTags()
  }

  private async getTags() {
    this.tags = this.qTags = await this.tagProvider.load()
  }

  public reloadTags() {
    this.tags = this.qTags;
  }

  public searchTags(event) {
    this.reloadTags();

    const value = event.target.value;

    if (value && value.trim() != '') {
      this.tags = this.tags.filter((tag: any) => {
        return (tag.text.toLowerCase().indexOf(value.toLowerCase()) > -1)
      })

      this.noResultsQuery = this.tags.length === 0;
    }
  }

  public dismissView(data?: { }) {
    this.viewCtrl.dismiss(data)
  }
}
