import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from '../components/components.module';
import { DirectivesModule } from '../directives/directives.module';

import { UserTemplate } from './user/user';

@NgModule({
	declarations: [
    UserTemplate
  ],
	
  imports: [
    // 
    // Import the IonicModule in order to make use of the Ionic's Components ( ion-row, ion-card etc.. )
    // 
    IonicModule,
    
    CommonModule,
    ComponentsModule,
    DirectivesModule
  ],
	
  exports: [
    UserTemplate
  ]
})

export class TemplatesModule { }
