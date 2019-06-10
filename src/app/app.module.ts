import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Device } from '@ionic-native/device/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HTTPInterceptor } from './services/http.interceptor';
import { CachingInterceptor } from './services/caching.interceptor';
import { RequestCacheService } from './services/request-cache.service';

import { ComponentsModule } from './components/components.module';

import { UserPageModule } from './pages/user/user.module';
import { UserCardPageModule } from './pages/user-card/user-card.module';
import { UserEditPageModule } from './pages/user-edit/user-edit.module';
import { NotificationsPageModule } from './pages/notifications/notifications.module';
import { PostPageModule } from './pages/post/post.module';
import { PostFormPageModule } from './pages/post-form/post-form.module';
import { TagsPageModule } from './pages/tags/tags.module';

import { ActionCableService } from 'angular2-actioncable';

import { AuthenticationGuardService } from './guards/authentication';

@NgModule({
  declarations: [
    AppComponent,
  ],

  entryComponents: [],

  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    ComponentsModule,
    UserPageModule,
    UserCardPageModule,
    UserEditPageModule,
    NotificationsPageModule,
    PostPageModule,
    PostFormPageModule,
    TagsPageModule
  ],

  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Device,
    InAppBrowser,
    WebView,
    File,
    FileTransfer,
    RequestCacheService,

    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },

    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: HTTPInterceptor,
    //   multi: true
    // },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: CachingInterceptor,
      multi: true
    },

    AuthenticationGuardService,
    ActionCableService
  ],

  bootstrap: [AppComponent]
})

export class AppModule {}
