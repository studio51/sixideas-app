import { Injectable } from '@angular/core';

import { SixIdeasHTTPService } from '../services/http';

@Injectable()
export class MetaProvider {
  constructor(public http: SixIdeasHTTPService) { }
 
  public mentions(query: string) {
    return this.http.get('community/users.json', { params: { q: query }})
  }

  public tags(query: string) {
    return this.http.get('community/tags.json', { params: { q: query }})
  }

  public colours() {
    return this.http.get(`users/colours`)
  }

  public interests() {
    return this.http.get(`users/interests`)
  }
}
