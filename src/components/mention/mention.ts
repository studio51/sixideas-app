import { Component, Input } from '@angular/core';
import { Events } from 'ionic-angular';

import { ModalController } from 'ionic-angular';

@Component({
  selector: 'mention',
  templateUrl: 'mention.html'
})

export class MentionComponent {
  @Input() body: string;
  @Input() class: string;

  constructor(
    public events: Events,
    public modalCtrl: ModalController

  ) { }

  public parseBody() {
    const body = this.body
      .replace(/\B\@([a-zA-Z0-9_-]+)/g, (originalValue, match): any => this.createElementss(originalValue, match, 'mention'))
      .replace(/\B\S*#(\[[^\]]+\]|\S+)/g, (originalValue, match): any => this.createElementss(originalValue, match, 'tag'));

    return body
  }

  public viewProfile(event: any) {
    const node: any = event.srcEvent.path[0];

    if (node.nodeName != 'ABBR') return
    
    const type: string = node.getAttribute('type')
    const options: any = {}

    if (type === 'mention') {
      options['username'] = node.getAttribute('value');

      const modal: any = this.modalCtrl.create('ProfilePage', options);
            modal.present();

    } else if (type === 'tag') {
      options['tag'] = node.getAttribute('value');

      this.events.publish('post:tagged', options)
    }
  }

  private createElementss(key: string, value: string, type: string) {
    const div: any  = document.createElement('div'),
          abbr: any = document.createElement('abbr');

    abbr.setAttribute('value', value);
    abbr.setAttribute('type', type);
    abbr.innerHTML = key;
    
    div.append(abbr);

    return div.innerHTML;
  }
}
