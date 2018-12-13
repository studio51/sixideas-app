import { Component, Input } from '@angular/core';
import { Events, App, ViewController, ModalController } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'mention',
  templateUrl: 'mention.html'
})

export class MentionComponent {
  @Input() body: string;
  @Input() class: string;

  constructor(
    private events: Events,
    private appCtrl: App,
    private iab: InAppBrowser,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController

  ) { }
  
  public parseBody() {
    const body = this.body
      .replace(/\B\@([a-zA-Z0-9_-]+)/g, (originalValue, match): any => this.createElement(originalValue, match, 'mention'))
      .replace(/\B\S*#(\[[^\]]+\]|\S+)/g, (originalValue, match): any => this.createElement(originalValue, match, 'tag'))
      .replace(/(https?:\/\/[^\s]+)/g, (originalValue, match): any => this.createElement(originalValue, match, 'url'));

    return body;
  }

  public async viewMention(event: any) {
    const node: any = event.target;

    if (node.nodeName != 'ABBR') return;
    
    const type: string = node.getAttribute('type');
    const value: string = node.getAttribute('value');

    if (type === 'mention') {
      const modal: any = await this.modalCtrl.create('ProfilePage', {
        username: value
      });
      
      await modal.present();
    } else if (type === 'tag') {
      this.events.publish('post:tagged', value);

      if (this.viewCtrl.isOverlay) {
        this.viewCtrl.dismiss();
      }
  
      await this.appCtrl
        .getRootNavs()[0]
        .getActiveChildNavs()[0]
        .select(0);

    } else if (type === 'url') {
      await this.iab.create(node.getAttribute('value'), '_system');
    }
  }

  private createElement(key: string, value: string, type: string) {
    const div: any  = document.createElement('div'),
          child: any = document.createElement('abbr');

    child.setAttribute('value', value);
    child.setAttribute('type', type);
    child.innerHTML = key;

    div.append(child);

    return div.innerHTML;
  }
}
