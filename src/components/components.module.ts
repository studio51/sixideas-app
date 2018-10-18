import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DirectivesModule } from '../directives/directives.module';

import { UserAvatarComponent } from './user-avatar/user-avatar';
import { PostComponent } from './post/post';
import { CommentsComponent } from './comments/comments';
import { PreviewComponent } from './preview/preview';
import { LikeComponent } from './like/like';
import { MentionComponent } from './mention/mention';

@NgModule({
	declarations: [
    UserAvatarComponent,
    PostComponent,
    CommentsComponent,
    PreviewComponent,
    LikeComponent,
    MentionComponent
  ],
  
  entryComponents: [MentionComponent],
	
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
    PostComponent,
    CommentsComponent,
    PreviewComponent,
    LikeComponent,
    MentionComponent
  ]
})

export class ComponentsModule { }
