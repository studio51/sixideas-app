import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from 'src/app/components/components.module';

import { FeedPage } from './feed.page';

const routes: Routes = [
  {
    path: '',
    component: FeedPage
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],

  declarations: [FeedPage]
})

export class FeedPageModule {}
