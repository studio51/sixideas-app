import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';

import { UsersPage } from './users';

@NgModule({
  declarations: [UsersPage],
  imports: [
    IonicPageModule.forChild(UsersPage),
    ComponentsModule,
    DirectivesModule
  ]
})

export class UsersPageModule { }
