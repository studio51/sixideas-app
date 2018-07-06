import { Component, Input } from '@angular/core';
import { ModalController } from 'ionic-angular';

@Component({
  selector: 'mention',
  templateUrl: 'mention.html'
})

export class MentionComponent {
  @Input() body: string;
  @Input() class: string;

  constructor(
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
    let page: string = null;
    const options: any = {}

    if (type === 'mention') {
      page = 'ProfilePage';
      options['username'] = node.getAttribute('value');
    } else if (type === 'tag') {
      page = 'CommunityPage';
      options['tag'] = node.getAttribute('value');
    }

    const modal: any = this.modalCtrl.create(page, options);
          modal.present();
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
