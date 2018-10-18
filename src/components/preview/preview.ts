import { Component, OnInit, Input } from '@angular/core';

import { PostProvider } from '../../providers/post';

import * as getURLs from 'get-urls';

@Component({
  selector: 'preview',
  templateUrl: 'preview.html'
})

export class PreviewComponent implements OnInit {
  @Input() body: string;

  public preview: any;

  constructor(
    private postProvider: PostProvider
  
  ) { }

  // Make sure it's first initialized otherwise we'll get undefined from
  // the body input.
  // 
  ngOnInit() {
    this.check()
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
          return
        }

        throw new Error('Request failed or the API returned no acceptable response.');
      } else if ( URLs.size === 0) { this.preview = null }
    }
    console.log(this.body)
    return;
  }
}
