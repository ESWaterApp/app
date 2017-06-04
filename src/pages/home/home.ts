import { Component, Inject } from '@angular/core';
import { NavController, Platform, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { VerifyLocationPage } from '../verifyLocation/verifyLocation'
import { AngularFire, FirebaseAuthState, FirebaseApp } from 'angularfire2';
import { GooglePlus } from 'ionic-native';
import { AuthService } from '../../providers/auth-service';
import { ReportService } from '../services/ReportService';
import { DisplayService } from '../services/DisplayService';
import { PrivacyPage } from '../privacy/privacy';
import firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title center>ZotReport</ion-title>
    </ion-navbar>
  </ion-header>
  <ion-content padding>
    <div>
      <img src="assets/img/app_icon.png" style="display: block; width: 100%; height: auto; margin-left: auto; margin-right: auto;">
    </div>
    <ion-buttons>
      <button (click)="logInGoogle()" ion-button block large color="danger">
        Report
      </button>
    </ion-buttons>
  </ion-content>
  `
})

export class HomePage {
  loader: any;
  db: firebase.database.Reference;
  privacyModal: any;
  constructor(public navCtrl: NavController, private af: AngularFire, @Inject(FirebaseApp) private firebaseApp: firebase.app.App, private _auth: AuthService, private platform: Platform, private alertController: AlertController, private loadCtrl: LoadingController, private reportService: ReportService, private displayService: DisplayService, public modalCtrl: ModalController) {
    this.loader = loadCtrl.create({
      content: "Signing in..."
    });
    this.db = this.firebaseApp.database().ref();
    this.privacyModal = this.modalCtrl.create(PrivacyPage);
  }
  logInGoogle(evt): void {
      if(this.reportService.has_reported) {
        this.goToVerify(this.reportService.getUserid());
        return;
      }
      this.af.auth.subscribe((data: FirebaseAuthState) => {
        GooglePlus.trySilentLogin({
          'webClientId' : '186149461117-jfun8jk0qqo9em8ujf0r0kp3ivdg8ndp.apps.googleusercontent.com'
        }).then((success) => {
          this.goToVerify(success["email"].split("@")[0]);
        }).catch((fail) => {
          this.af.auth.complete();
          this.privacyModal.onDidDismiss((flag) => {
            if(flag === "failure")
              return;
            this.displayService.displayAlert("You must sign in with a UCI email", "UCI only.").then((success) => {
              this.googleSignIn();
            }).catch((fail) => {
              this.googleSignIn();
            });
          });
          this.platform.ready().then(() => {
             this.privacyModal.present({
              ev: evt
             });
          })
        });
      })
  }
  googleSignIn() {
    this.loader.present();
     GooglePlus.login({
          'webClientId' : '186149461117-jfun8jk0qqo9em8ujf0r0kp3ivdg8ndp.apps.googleusercontent.com'
     })
     .then((userData) => {
        var provider = firebase.auth.GoogleAuthProvider.credential(userData.idToken);

         firebase.auth().signInWithCredential(provider)
         .then((success) => {
            this.loader.dismiss();
            if (success["email"].split("@")[1] == "uci.edu") {
              this.af.auth.unsubscribe();
              this.db.child("Users").update({[success["email"].split("@")[0]] : {Email: success["email"], Reports: {}}});
              this.goToVerify(success["email"].split("@")[0]);
            }
            else {
              Promise.all([GooglePlus.logout(),
                           this.displayService.displayAlert("Invalid email", "UCI accounts only please.")]).then((success) => {
                this.googleSignIn()
              });;
            }
        })
        .catch((error) => {
          this.loader.dismiss();
          this.displayService.displayAlert(error,"signInWithCredential failed")
          GooglePlus.disconnect();
        })
     })
     .catch((gplusErr) => {
        this.displayService.displayAlert(gplusErr,"GooglePlus failed")
        GooglePlus.disconnect();
     });
  }
  goToVerify(username: string): void {
    this.reportService.setUserid(username);;
    //Go to the verification page
    this.navCtrl.push(VerifyLocationPage);
  }
}
