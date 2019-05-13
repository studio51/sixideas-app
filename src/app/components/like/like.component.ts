import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

import { LikeProvider } from 'src/app/providers/like';

import { Like } from 'src/app/interfaces/like';
import { User } from 'src/app/interfaces/user';

enum LikeClass {
  Post    = 'Post',
  Comment = 'Comment'
}

enum LikeSize {
  Small = 'small',
  Large = 'large'
}

@Component({
  selector: 'app-like',
  templateUrl: './like.component.html',
  styleUrls: ['./like.component.scss'],
})

export class LikeComponent implements OnInit {
  @Input() likeable: Like;
  @Input() user: User;

  @Input() color: string = 'danger';
  @Input() class: 'Post' | 'Comment' = 'Post';
  @Input() size: 'small' | 'large' = 'small';

  @Input() showCounter: boolean = false;

  @Output() decided = new EventEmitter<number>();

  params: any = {}
  counter: number = 0;
  waitingForFeedback: boolean = false;

  constructor(
    public likeProvider: LikeProvider

  ) { }

  ngOnInit() {
    this.setParameters();

    if (this.likeable.likes) {
      this.updateCounter(this.likeable.likes.length)
    }
  }

  public decide() {
    this.waitingForFeedback = true;
    (this.liked ? this.unlike() : this.like());
  }

  private async like() {
    this.updateCounter();
    this.handleServerResponse(await this.likeProvider.like(this.params));
  }

  private async unlike() {
    this.updateCounter(-1);
    this.handleServerResponse(await this.likeProvider.unlike(this.params));
  }

  private updateCounter(count?: number) {
    this.counter = (count ? count : (this.counter += 1));
  }

  private handleServerResponse(response: any) {

    // Set the Likeable object with the Likeable object received by the API
    //
    this.likeable = response.likeable;

    // Send the new likes counter to all the listeners, so far only used
    // by the PostComponent
    //
    this.decided.emit(response.counter);

    // Update the local counters, so far only used by the CommentComponent
    this.updateCounter(response.counter);

    // Hide the loading indicator
    //
    this.waitingForFeedback = false;
  }

  private setParameters() {
    this.params['like'] = { };
    this.params['like']['likeable_type'] = this.class;
    this.params['like']['likeable_id'] = this.likeable._id.$oid;
  }

  get liked(): boolean {
    return (this.likeable.likes || []).filter((like: any) => like.user_id.$oid === this.user._id.$oid).length === 1
  }
}


