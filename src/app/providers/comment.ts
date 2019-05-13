import { Injectable } from '@angular/core';
import { HTTPService } from '../services/http.service';

@Injectable({
  providedIn: 'root'
})
export class CommentProvider {
  constructor(public http: HTTPService) { }

  public load(postID: string, params?: any): Promise<any> {
    return this.http.get(`posts/${ postID }/comments`, { params: params });
  }

  public get(id: string): Promise<any> {
    return this.http.get(`comments/${ id }`);
  }

  public create(postID: string, comment: Comment): Promise<any> {
    return this.http.post(`posts/${ postID }/comments`, comment);
  }

  public update(commentID: string, comment: Comment): Promise<any> {
    return this.http.patch(`comments/${ commentID }`, comment);
  }
}