import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';

import { ProfileFormPage } from './profile-form';

@NgModule({
  declarations: [ProfileFormPage],
  imports: [
    IonicPageModule.forChild(ProfileFormPage),
    ComponentsModule,
    DirectivesModule
  ]
})

export class ProfileFormPageModule { }
