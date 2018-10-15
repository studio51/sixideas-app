import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Ng2CableModule } from 'ng2-cable';

import { SixIdeasApp } from './app.component';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

/*** Native Components ***/

import { Push } from '@ionic-native/push';
import { Device } from '@ionic-native/device';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';

/*** Services ************/

import { SixIdeasHTTPModule } from '../services/http.module';
import { NotificationService } from '../services/notification';

/*** Providers * HTTP ***/

import { SessionProvider } from '../providers/session';
import { MetaProvider } from '../providers/meta';
import { UserProvider } from '../providers/user';
import { FeedProvider } from '../providers/feed';
import { TagProvider } from '../providers/tag';
import { PostProvider } from '../providers/post';
import { CommentProvider } from '../providers/comment';
import { LikeProvider } from '../providers/like';
import { ImageProvider } from '../providers/image';

import { HTTPInterceptor } from '../services/http.interceptor';

@NgModule({
  declarations: [SixIdeasApp],
  
  imports: [
    BrowserModule,
    HttpClientModule, SixIdeasHTTPModule,
    IonicModule.forRoot(SixIdeasApp, {
      mode: 'ios',
      iconMode: 'ios'
    }),
    IonicStorageModule.forRoot(),
    Ng2CableModule
  ],
  
  bootstrap: [IonicApp],
  entryComponents: [SixIdeasApp],

  providers: [
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    
    /*** Native Components ***/        
    
    Push, Device, StatusBar, SplashScreen, Camera, FileTransfer,

    /*** Services ************/

    NotificationService,

    /*** Providers * HTTP ****/
    
    SessionProvider, MetaProvider, UserProvider, FeedProvider, TagProvider,
    PostProvider, CommentProvider, LikeProvider, ImageProvider,

    { 
      provide: HTTP_INTERCEPTORS,
      useClass: HTTPInterceptor,
      multi: true
    }
  ]
})

export class AppModule { }
