import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { IonicModule } from '@ionic/angular';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TributeDirective } from './tribute.directive';
import { UnlessDirective } from './unless.directive';

const directives: Array<any> = [
  TributeDirective,
  UnlessDirective
];

@NgModule({
  imports: [
    // CommonModule,
    // IonicModule,
    // FormsModule,
    // ReactiveFormsModule
  ],

  exports: directives,
  declarations: directives
})

export class DirectivesModule { }