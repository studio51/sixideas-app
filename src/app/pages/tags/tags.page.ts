import { Component, OnInit, Input } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { Tag } from 'src/app/interfaces/tag';
import { User } from 'src/app/interfaces/user';

import { TagProvider } from 'src/app/providers/tag';
import { UserProvider } from 'src/app/providers/user';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.page.html',
  styleUrls: ['./tags.page.scss'],
})

export class TagsPage implements OnInit {
  tags: Tag[];
  // favouriteTags: Tag[];
  _tags: Tag[];

  @Input() user: User;
  @Input() userTags: Tag[];

  processing: boolean = false;
  currentTag: Tag;

  constructor(
    public modalCtrl: ModalController,
    public tagProvider: TagProvider,
    public userProvider: UserProvider

  ) { }

  contains: Function = (array, object) => array.some((e: any) => e._id.$oid === object._id.$oid);

  async ngOnInit() {
    const tags: Tag[] = await this.tagProvider.load();

    tags.forEach(async (tag: Tag) => {
      tag['favorite'] = this.contains(this.userTags, tag);
    });

    // this.favouriteTags = tags.filter((tag: Tag) => tag.favorite === true);
    this.tags = this._tags = tags;
  }

  public async decide(tag: Tag) {
    this.currentTag = tag;
    this.processing = !this.processing;

    const id: string = tag._id.$oid;

    if (tag.favorite) {
      this.userTags.splice(this.userTags.map((tag: Tag) => tag._id.$oid).indexOf(id), 1);
    } else {
      this.userTags.push(tag);
    }

    this.updateUser(tag);
  }

  private async updateUser(tag: Tag) {
    let data: any = {};
        data['tag_ids'] = this.userTags.map((tag: Tag) => tag._id.$oid);

    const response: User = await this.userProvider.update(this.user._id.$oid, data);

    if (response) {
      tag.favorite = !tag.favorite;
    } else {
      // TODO
    }

    this.processing = !this.processing;
    this.currentTag = null;
  }

  public async search(event: any) {
    this.tags = this._tags;

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

  public async filter(tag: Tag) {
    this.dismiss(tag);
  }

  public async dismiss(tag?: Tag) {
    this.modalCtrl.dismiss(tag);
  }
}
