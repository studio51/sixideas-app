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
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HTTPInterceptor } from './services/http.interceptor';
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

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { Firebase } from '@ionic-native/firebase/ngx';

import { AuthenticationService } from './services/authentication.service';

const config: any = {
  apiKey:             "AIzaSyAK4x_V6tw_0NkjU0D6KSZw9xB-aaPijns",
  authDomain:         "studio51-cogitor-sixideas.firebaseapp.com",
  databaseURL:        "https://studio51-cogitor-sixideas.firebaseio.com",
  projectId:          "studio51-cogitor-sixideas",
  storageBucket:      "",
  messagingSenderId:  "836345759664",
  appId:              "1:836345759664:web:e6fb5ef1aa37cbad"
};

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
    
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    
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
    Firebase,
    Camera,
    Device,
    InAppBrowser,
    WebView,
    PhotoViewer,
    File,
    FileTransfer,
    RequestCacheService,

    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: HTTPInterceptor,
      multi: true
    },

    AuthenticationService,
    ActionCableService
  ],

  bootstrap: [AppComponent]
})

export class AppModule {}
