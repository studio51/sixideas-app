import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DirectivesModule } from '../directives/directives.module';

import { ContentDrawerComponent } from './content-drawer/content-drawer';
import { UserAvatarComponent } from './user-avatar/user-avatar';
import { PostComponent } from './post/post';
import { CommentsComponent } from './comments/comments';
import { LikeComponent } from './like/like';

@NgModule({
	declarations: [
    ContentDrawerComponent,
    UserAvatarComponent,
    PostComponent,
    CommentsComponent,
    LikeComponent
  ],
	
  imports: [
    // 
    // Import the IonicModule in order to make use of the Ionic's Components ( ion-row, ion-card etc.. )
    // 
    IonicModule,
    
    CommonModule,
    DirectivesModule
  ],
	
  exports: [
    UserAvatarComponent,
    ContentDrawerComponent,
    PostComponent,
    CommentsComponent,
    LikeComponent
  ]
})

export class ComponentsModule { }
