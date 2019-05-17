import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AppereanceService {
  public change: Subject<any> = new Subject();
}