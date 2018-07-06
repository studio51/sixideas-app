import { Component, Input } from '@angular/core';

import { Post } from '../../models/post';
import { User } from '../../models/user';

@Component({
  selector: 'post',
  templateUrl: 'post.html'
})

export class PostComponent {
  @Input() post: Post;
  @Input() user: User;

  constructor() { }
}