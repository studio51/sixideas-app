import { Component, Input } from '@angular/core';

import { User } from '../../models/user';

@Component({
  selector: 'user-avatar',
  templateUrl: 'user-avatar.html'
})

export class UserAvatarComponent {
  @Input() user: User;

  constructor() { }
}
