import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PreviewResponse } from '../interfaces/preview.response';

@Injectable({
  providedIn: 'root'
})

export class PreviewProvider {
  constructor(public http: HttpClient) { }

  private key: string = '5cf7afc350780c7bf6d5cc46eabd157d7bb7e037b3e00';

  public get(url: string): Promise<any> {
    return this.http
      .get(`https://api.linkpreview.net/?key=${ this.key }&q=${ url }`)
      .toPromise();
  }
}
