import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ComponentsModule } from '../../components/components.module';

import { ProfileFormPage } from './profile-form';

@NgModule({
  declarations: [ProfileFormPage],
  imports: [
    IonicPageModule.forChild(ProfileFormPage),
    ComponentsModule
  ]
})

export class ProfileFormPageModule { }
