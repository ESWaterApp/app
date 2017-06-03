import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PrivacyPage } from '../pages/privacy/privacy';
import { VerifyLocationPage } from '../pages/verifyLocation/verifyLocation';
import { TakePicturePage } from '../pages/takePicture/takePicture';
import { CommentsPage } from '../pages/comments/comments';
import { AuthoritiesPage } from '../pages/authorities/authorities';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';
//Inject the AuthService
import { AuthService } from '../providers/auth-service';
import { DisplayService } from '../pages/services/DisplayService';

import { ElasticModule } from 'angular2-elastic';
import { SocialSharing } from '@ionic-native/social-sharing';

const firebaseConfig = {
  apiKey: "AIzaSyCqWaEWh06Ju65WF_LBkkKShnxFpFwb5CQ",
  authDomain: "waterapp-effd4.firebaseapp.com",
  databaseURL: "https://waterapp-effd4.firebaseio.com",
  storageBucket: "waterapp-effd4.appspot.com",
  messagingSenderId: "186149461117"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PrivacyPage,
    VerifyLocationPage,
    TakePicturePage,
    CommentsPage,
    AuthoritiesPage
  ],
  imports: [
    IonicModule.forRoot(MyApp), 
    AngularFireModule.initializeApp(firebaseConfig),
    ElasticModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PrivacyPage,
    VerifyLocationPage,
    TakePicturePage,
    CommentsPage,
    AuthoritiesPage
  ],
  providers: [
    {provide: ErrorHandler, 
    useClass: IonicErrorHandler},
    AuthService,
    DisplayService,
    SocialSharing
  ]
})
export class AppModule {}
