import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { VerifyLocationPage } from '../pages/verifyLocation/verifyLocation';
import { TakePicturePage } from '../pages/takePicture/takePicture';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';
//Inject the AuthService
import { AuthService } from '../providers/auth-service';

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
    VerifyLocationPage,
    TakePicturePage
  ],
  imports: [
    IonicModule.forRoot(MyApp), 
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    VerifyLocationPage,
    TakePicturePage
  ],
  providers: [
    {provide: ErrorHandler, 
    useClass: IonicErrorHandler},
    AuthService
  ]
})
export class AppModule {}
