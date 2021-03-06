import { Component, OnInit, Input } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

import { InAppBrowser } from '@ionic-native/in-app-browser';

import { PostProvider } from '../../providers/post';

import * as getURLs from 'get-urls';

@Component({
  selector: 'preview',
  templateUrl: 'preview.html'
})

export class PreviewComponent implements OnInit {
  @Input() body: string;

  public preview: any;
  public sanitizedURL: SafeResourceUrl;

  constructor(
    private iab: InAppBrowser,
    private postProvider: PostProvider,
    private domSanitizer: DomSanitizer
    
  ) { }

  // Make sure it's first initialized otherwise we'll get undefined from
  // the body input.
  // 
  ngOnInit() {
    this.check();
  }

  public async openIAB(url: string) {
    await this.iab.create(url, '_system');
  }

  private async check() {
    if (this.body) {
      const URLs: Set<any> = getURLs(this.body);

      // Check and see if there are any URLs in the string for us to check. Also,
      // really important, check to make sure we haven't already created a preview for it.
      // 
      if (URLs.size > 0 && !this.preview) {
        
        // We only want the first URL to render a preview
        // 
        const url: string = URLs.entries().next().value[0];
        const response: any = await this.postProvider.preview(url);

        if (response) {
          this.preview = response;
          
          if (response.iframe) {
            this.sanitizedURL = this.sanitizeURL(response.url);
          }

          return;
        }

        throw new Error('Request failed or the API returned no acceptable response.');
      } else if ( URLs.size === 0) { this.preview = null }
    }

    return;
  }

  private sanitizeURL(url: string): SafeResourceUrl {
    url = url
      .replace('watch?v=', 'embed/')
      .replace('youtu.be/', 'youtube.com/embed/');

    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
