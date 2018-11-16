import { Injectable } from '@angular/core';

import { SixIdeasHTTPService } from '../services/http';

@Injectable()
export class NotificationProvider {
  constructor(
    public http: SixIdeasHTTPService
  
  ) { }

  public load() {
    return this.http.get('notifications');
  }

  public markAllRead() {
    return this.http.get('notifications/mark_read');
  }
}
