import { Component, OnInit, Input } from '@angular/core';
import { Response, RequestOptionsArgs } from '@angular/http';

import { Storage } from '@ionic/storage';

import { Post } from '../../models/post';
import { Comment } from '../../models/comment';
import { User } from '../../models/user';

import { LikeProvider } from '../../providers/like';

@Component({
  selector: 'like',
  templateUrl: 'like.html'
})

export class LikeComponent implements OnInit {
  @Input() likeable: Post | Comment;
  @Input() user: User;

  @Input() class: string;
  @Input() size: string;

  params: RequestOptionsArgs = { };
  counter: number = 0;

  waitingServerConfirmation: boolean = false;

  constructor(
    public storage: Storage,
    public likeProvider: LikeProvider
  
  ) { }

  ngOnInit() {
    this.setParameters()

    if (this.likeable.likes) {
      this.updateCounter(this.likeable.likes.length)
    }
  }

  public decide() {
    this.waitingServerConfirmation = true;
    
    (this.liked ? this.unlike() : this.like());
  }

  get liked(): boolean {
    return (this.likeable.likes || []).filter((like: any) => like.user_id.$oid === this.user.uuid).length === 1
  }

  private like() {
    this.updateCounter();

    this.likeProvider.like(this.params).subscribe((response: any) => {
      this.handleServerResponse(response)
    }, (error: any) => {
      console.log(error)
    })
  }
  
  private unlike() {
    this.updateCounter(-1);
    
    this.likeProvider.unlike(this.params).subscribe((response: any) => {
      this.handleServerResponse(response)
    }, (error: any) => {
      console.log(error)
    })
  }

  private setParameters() {
    this.params['like'] = { };
    this.params['like']['likeable_type'] = this.class
    this.params['like']['likeable_id'] = this.likeable.uuid
  }

  private handleServerResponse(response: any) {
    this.likeable = response.likeable;
    this.updateCounter(response.counter);
    
    this.waitingServerConfirmation = false;
  }

  private updateCounter(count?: number) {
    this.counter = (count ? count : (this.counter += 1))
  }
}
