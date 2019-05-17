import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';

import { PostFormPage } from './post-form.page';

const routes: Routes = [
  {
    path: '',
    component: PostFormPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ComponentsModule,
    DirectivesModule,
    RouterModule.forChild(routes)
  ],

  declarations: [PostFormPage]
})

export class PostFormPageModule {}
