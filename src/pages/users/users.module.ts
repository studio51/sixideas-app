import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ComponentsModule } from '../../components/components.module';

import { UsersPage } from './users';

@NgModule({
  declarations: [UsersPage],
  imports: [
    IonicPageModule.forChild(UsersPage),
    ComponentsModule
  ]
})

export class UsersPageModule { }
