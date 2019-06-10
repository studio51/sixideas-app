import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { UserCardPage } from '../../pages/user-card/user-card.page';

@Component({
  selector: 'app-mention',
  templateUrl: './mention.component.html',
  styleUrls: ['./mention.component.scss'],
})

export class MentionComponent implements OnInit {
  @Input() body: any;
  @Input() class: string = '';

  $body: string;

  constructor(
    public modalCtrl: ModalController,
    public inAppBrowser: InAppBrowser

  ) { }

  ngOnInit() {
    this.$body = this.body
      .replace(/\B\@([a-zA-Z0-9_-]+)/g, (value: any, match: any): any => this.createElement(value, match, 'mention'))
      .replace(/\B\S*#(\[[^\]]+\]|\S+)/g, (value: any, match: any): any => this.createElement(value, match, 'tag'))
      .replace(/(https?:\/\/[^\s]+)/g, (value: any, match: any): any => this.createElement(value, match, 'url'));

  }

  public async viewMention(event: any) {
    const node: any = event.target;

    if (node.nodeName != 'STRONG') return;

    const type: string = node.getAttribute('type'),
          value: string = node.getAttribute('value');

    if (type === 'mention') {
      const modal: any = await this.modalCtrl.create({
        component: UserCardPage,
        componentProps: {
          id: value
        }
      });

      return await modal.present();
    } else if (type === 'tag') {
      // this.events.publish('post:tagged', value);

      // if (this.viewCtrl.isOverlay) {
      //   this.viewCtrl.dismiss();
      // }

      // await this.appCtrl
      //   .getRootNavs()[0]
      //   .getActiveChildNavs()[0]
      //   .select(0);

    } else if (type === 'url') {
      await this.inAppBrowser.create(value, '_system');
    }
  }

  private createElement(key: string, value: string, type: string) {
    const div: any  = document.createElement('div'),
          child: any = document.createElement('strong');

    child.setAttribute('value', value);
    child.setAttribute('type', type);
    child.innerHTML = key;

    div.append(child);

    return div.innerHTML;
  }
}
