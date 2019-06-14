import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
import { AuthenticationGuard } from 'src/app/guards/authentication';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/tabs/feed',
    pathMatch: 'full',
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'tabs',
    component: TabsPage,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: '',
        redirectTo: '/tabs/feed',
        pathMatch: 'full'
      },
      {
        path: 'feed',
        children: [
          {
            path: '',
            loadChildren: '../feed/feed.module#FeedPageModule'
          }
        ]
      },
      {
        path: 'community',
        children: [
          {
            path: '',
            loadChildren: '../community/community.module#CommunityPageModule'
          }
        ]
      },
      {
        path: 'notifications',
        children: [
          {
            path: '',
            loadChildren: '../notifications/notifications.module#NotificationsPageModule'
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
