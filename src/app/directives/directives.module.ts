import { NgModule } from '@angular/core';

import { TributeDirective } from './tribute.directive';
import { PreviewDirective } from './preview.directive';
import { UnlessDirective } from './unless.directive';

const directives: Array<any> = [
  TributeDirective,
  PreviewDirective,
  UnlessDirective
];

@NgModule({
  imports: [],

  exports: directives,
  declarations: directives
})

export class DirectivesModule { }