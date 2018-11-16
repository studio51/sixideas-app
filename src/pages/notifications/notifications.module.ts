import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';

import { NotificationsPage } from './notifications';

@NgModule({
  declarations: [NotificationsPage],
  imports: [
    IonicPageModule.forChild(NotificationsPage),
    ComponentsModule,
    DirectivesModule
  ]
})

export class NotificationsPageModule { }
