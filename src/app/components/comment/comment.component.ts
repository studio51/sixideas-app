import { Component, Input, OnInit } from '@angular/core';

import { User } from 'src/app/interfaces/user';

// 3rd party plugins
//
import * as Sugar from 'sugar/date';

Sugar.Date.extend({
  methods: ['relative']
});

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})

export class CommentComponent implements OnInit {
  @Input() comment: Comment;
  @Input() user: User;

  constructor() { }

  ngOnInit() {}

  public timeAgoInWords(date: Date) {
    // @ts-ignore
    return new Date(date).relative();
  }
}
