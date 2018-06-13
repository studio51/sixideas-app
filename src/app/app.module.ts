import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SixIdeasApp } from './app.component';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

/***** Native Components *****/

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';

/***** Providers * HTTP *****/

import { FeedProvider } from '../providers/feed/feed';
import { UserProvider } from '../providers/user/user';

@NgModule({
  declarations: [SixIdeasApp],
  
  imports: [
    BrowserModule,
    IonicModule.forRoot(SixIdeasApp)
  ],
  
  bootstrap: [IonicApp],
  entryComponents: [SixIdeasApp],

  providers: [
    StatusBar,
    SplashScreen,

    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    
    /***** Native Components *****/        

    Camera,

    /***** Providers * HTTP *****/

    FeedProvider,
    UserProvider
  ]
})

export class AppModule { }
