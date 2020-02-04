import { Injectable } from '@angular/core';

import { Subscription, Observable } from 'rxjs';
import { ActionCableService, Channel } from 'angular2-actioncable';

@Injectable({
  providedIn: 'root'
})

export class CableProvider {
  subscription: Subscription;

  constructor(
    public cableService: ActionCableService,

  ) { }

  public appearances(): Observable<any> {
    const channel: Channel = this.cableService
      .cable('http://192.168.0.11:3000/api/v1/cable?token=5bc8bd7796e80d3b97f0e179')
      .channel('AppearanceChannel', {
        room: 'appearances'
      });

    return channel.received();
  }

  public posts(): Observable<any> {
    const channel: Channel = this.cableService
      .cable('http://192.168.0.11:3000/api/v1/cable?token=5bc8bd7796e80d3b97f0e179')
      .channel('NewPostsChannel', {
        room: 'counter'
      });

    return channel.received();
  }
}
