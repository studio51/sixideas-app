import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PostComponent } from './post/post.component';
import { CommentComponent } from './comment/comment.component';
import { MentionComponent } from './mention/mention.component';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { LikeComponent } from './like/like.component';
import { PreviewComponent } from './preview/preview.component';

import { DirectivesModule } from 'src/app/directives/directives.module';

const components: Array<any> = [
  PostComponent,
  CommentComponent,
  MentionComponent,
  UserAvatarComponent,
  LikeComponent,
  PreviewComponent
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule
  ],

  declarations: components,
  entryComponents: components,
  exports: components
})

export class ComponentsModule { }