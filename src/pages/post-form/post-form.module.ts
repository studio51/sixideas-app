import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';

import { PostFormPage } from './post-form';

@NgModule({
  declarations: [PostFormPage],
  imports: [
    IonicPageModule.forChild(PostFormPage),
    ComponentsModule,
    DirectivesModule
  ]
})

export class PostFormPageModule { }
