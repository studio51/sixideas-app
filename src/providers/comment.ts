import { Injectable } from '@angular/core';
import { SixIdeasHTTPService } from '../services/http';

import { Comment } from '../models/comment';

@Injectable()
export class CommentProvider {
  constructor(public http: SixIdeasHTTPService) { }

  public load(postID: string) {
    return this.http.get(`posts/${ postID }/comments`)
  }

  public create(postID: string, comment: Comment) {
    return this.http.post(`posts/${ postID }/comments`, comment)
  }

  public update(commentID: string, comment: Comment) {
    return this.http.patch(`comments/${ commentID }`, comment)
  }
}
