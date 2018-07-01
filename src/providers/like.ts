import { Injectable } from '@angular/core';
import { SixIdeasHTTPService } from '../services/http';

@Injectable()
export class LikeProvider {
  constructor(public http: SixIdeasHTTPService) { }

  public like(likeable: any) {
    return this.http.post(`likes/like`, likeable)
  }

  public unlike(likeable: any) {
    return this.http.post(`likes/unlike`, likeable)
  }
}
