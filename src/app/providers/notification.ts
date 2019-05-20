import { Injectable } from '@angular/core';
import { HTTPService } from '../services/http.service';

import { Notification } from 'src/app/interfaces/notification';

@Injectable({
  providedIn: 'root'
})

export class NotificationProvider {
  constructor(public http: HTTPService) { }

  public load(): Promise<Notification[]> {
    return this.http.get('notifications');
  }

  public read() {
    return this.http.get('notifications/mark_read');
  }
}