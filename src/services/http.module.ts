import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { SixIdeasHTTPService } from './http';

@NgModule({
  imports: [HttpModule],
  declarations: [  ],
  providers: [SixIdeasHTTPService],
})

export class SixIdeasHTTPModule {}