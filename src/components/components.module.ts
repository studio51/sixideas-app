import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserAvatarComponent } from './user-avatar/user-avatar';
import { ContentDrawerComponent } from './content-drawer/content-drawer';

@NgModule({
	declarations: [
    UserAvatarComponent,
    ContentDrawerComponent
  ],
	
  imports: [CommonModule],
	
  exports: [
    UserAvatarComponent,
    ContentDrawerComponent
  ]
})

export class ComponentsModule { }
