import { Injectable } from '@angular/core';
import { HTTPService } from '../services/http.service';

@Injectable({
  providedIn: 'root'
})
export class LikeProvider {
  constructor(public http: HTTPService) { }

  public like(likeable: any): Promise<any> {
    return this.http.post(`likes/like`, likeable);
  }

  public unlike(likeable: any): Promise<any> {
    return this.http.post(`likes/unlike`, likeable);
  }
}
