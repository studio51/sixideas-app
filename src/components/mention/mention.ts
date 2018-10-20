import { Component, Input } from '@angular/core';
import { Events, App, ViewController, ModalController } from 'ionic-angular';

@Component({
  selector: 'mention',
  templateUrl: 'mention.html'
})

export class MentionComponent {
  @Input() body: string;
  @Input() class: string;

  constructor(
    public events: Events,
    public appCtrl: App,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController

  ) { }
  
  public parseBody() {
    const body = this.body
      .replace(/\B\@([a-zA-Z0-9_-]+)/g, (originalValue, match): any => this.createElement(originalValue, match, 'mention'))
      .replace(/\B\S*#(\[[^\]]+\]|\S+)/g, (originalValue, match): any => this.createElement(originalValue, match, 'tag'));

    return body;
  }

  // Based on the event, which can 
  // 
  public async viewMention(event: any) {
    const node: any = event.target;

    if (node.nodeName != 'ABBR') return;
    
    const type: string = node.getAttribute('type');
    const options: any = {}

    if (type === 'mention') {
      options['username'] = node.getAttribute('value');

      const modal: any = await this.modalCtrl
        .create('ProfilePage', options)
        .present();

    } else if (type === 'tag') {
      options['tag'] = node.getAttribute('value');

      this.events.publish('post:tagged', options);

      if (this.viewCtrl.isOverlay) {
        this.viewCtrl.dismiss();
      }
  
      await this.appCtrl
        .getRootNavs()[0]
        .getActiveChildNavs()[0]
        .select(0);
    }
  }

  private createElement(key: string, value: string, type: string) {
    const div: any  = document.createElement('div'),
          abbr: any = document.createElement('abbr');

    abbr.setAttribute('value', value);
    abbr.setAttribute('type', type);
    abbr.innerHTML = key;
    
    div.append(abbr);

    return div.innerHTML;
  }
}
