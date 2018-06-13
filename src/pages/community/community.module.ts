import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';

import { CommunityPage } from './community';

@NgModule({
  declarations: [CommunityPage],
  imports: [
    IonicPageModule.forChild(CommunityPage),
    ComponentsModule,
    DirectivesModule
  ]
})

export class CommunityPageModule { }
