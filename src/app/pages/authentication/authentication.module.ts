import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';

import { AuthenticationPage } from './authentication.page';

const routes: Routes = [
  {
    path: '',
    component: AuthenticationPage
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

  declarations: [AuthenticationPage]
})

export class AuthenticationPageModule {}
