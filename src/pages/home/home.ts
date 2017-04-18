import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { VerifyLocationPage } from '../verifyLocation/verifyLocation'
import { AngularFire, FirebaseAuthState } from 'angularfire2';
import { GooglePlus } from 'ionic-native';
import { AuthService } from '../../providers/auth-service';
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
  constructor(public navCtrl: NavController, private af: AngularFire, private _auth: AuthService, private platform: Platform, private alertController: AlertController) {
  }
  logInGoogle(): void {
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
                      if (success["email"].split("@")[1] == "uci.edu") {
                        this.af.auth.unsubscribe();
                        this.onSignInSuccess();
                      }
                      else {
                        this.displayAlert("Invalid email", "UCI accounts only please.");
                        GooglePlus.disconnect();
                      }
                    })
                    .catch((error) => {
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
