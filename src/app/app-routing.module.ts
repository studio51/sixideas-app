import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthenticationGuard } from './guards/authentication';

const routes: Routes = [
  {
    path: '',
    loadChildren: './pages/tabs/tabs.module#TabsPageModule',
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'authentication',
    loadChildren: './pages/authentication/authentication.module#AuthenticationPageModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {}