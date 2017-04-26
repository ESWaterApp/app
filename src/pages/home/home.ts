import { Component, Inject } from '@angular/core';
import { NavController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { VerifyLocationPage } from '../verifyLocation/verifyLocation'
import { AngularFire, FirebaseAuthState, FirebaseApp } from 'angularfire2';
import { GooglePlus } from 'ionic-native';
import { AuthService } from '../../providers/auth-service';
import { ReportService } from '../services/ReportService';
import firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title center>WaterSense</ion-title>
    </ion-navbar>
  </ion-header>
  <ion-content padding>
    <div>
      <img src="assets/img/esw_logo.png" style="display: block; width: 100%; height: auto; margin-left: auto; margin-right: auto;">
    </div>
    <ion-buttons>
      <button (click)="logInGoogle()" ion-button block large color="danger">
        Report
      </button>
    </ion-buttons>
    <ion-buttons>
      <button ion-button large block color="positive">
        View Status
      </button>
    </ion-buttons>
  </ion-content>
  `
})

export class HomePage {
  signed_in: boolean;
  loader: any;
  db: firebase.database.Reference;
  constructor(public navCtrl: NavController, private af: AngularFire, @Inject(FirebaseApp) private firebaseApp: firebase.app.App, private _auth: AuthService, private platform: Platform, private alertController: AlertController, private loadCtrl: LoadingController, private reportService: ReportService) {
    this.signed_in = false;
    this.loader = loadCtrl.create({
      content: "Signing in..."
    });
    this.db = this.firebaseApp.database().ref();
  }
  logInGoogle(): void {
      if(this.signed_in)
        this.goToVerify();
      this.loader.present();
      this.af.auth.subscribe((data: FirebaseAuthState) => {
          
          this.af.auth.complete();
          console.log("in auth subscribe", data)
   
          this.platform.ready().then(() => {
             GooglePlus.login({
                  'webClientId' : '186149461117-jfun8jk0qqo9em8ujf0r0kp3ivdg8ndp.apps.googleusercontent.com'
             })
             .then((userData) => {
                  console.log("userData " + JSON.stringify(userData));
                  console.log("firebase " + firebase);
                  var provider = firebase.auth.GoogleAuthProvider.credential(userData.idToken);
   
                   firebase.auth().signInWithCredential(provider)
                    .then((success) => {
                      this.loader.dismiss();
                      if (success["email"].split("@")[1] == "uci.edu") {
                        this.af.auth.unsubscribe();
                        this.signed_in = true;
                        this.reportService.setUserid(success["email"].split("@")[0]);
                        this.db.child("Users").update({[success["email"].split("@")[0]] : {Email: success["email"], Reports: {}}});
                        this.onSignInSuccess();
                      }
                      else {
                        this.displayAlert("Invalid email", "UCI accounts only please.");
                        GooglePlus.disconnect();
                      }
                    })
                    .catch((error) => {
                      this.loader.dismiss();
                      console.log("Firebase failure: " + JSON.stringify(error));
                      this.displayAlert(error,"signInWithCredential failed")
                      GooglePlus.disconnect();
                    });
   
                   })
               .catch((gplusErr) => {
                      console.log("GooglePlus failure: " + JSON.stringify(gplusErr));
                          this.displayAlert(JSON.stringify(gplusErr),"GooglePlus failed")
                          GooglePlus.disconnect();
                    });
   
              })
         })
  }
  private onSignInSuccess(): void {
    this.goToVerify();
  }
  goToVerify(): void {
    //Go to the verification page
    this.navCtrl.push(VerifyLocationPage);
  }

  displayAlert(value: {},title: string)
  {
      let coolAlert = this.alertController.create({
      title: title,
      message: JSON.stringify(value),
      buttons: [
                    {
                        text: "OK"
                    }
               ]
      });
      coolAlert.present();
    }
}
