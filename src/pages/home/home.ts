import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { VerifyLocationPage } from '../verifyLocation/verifyLocation'
import { AngularFire } from 'angularfire2';
import { AuthService } from '../../providers/auth-service';

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
  constructor(public navCtrl: NavController, af: AngularFire, private _auth: AuthService) {
  }
  logInGoogle() {
    this._auth.signInWithgoogle().then(() => {
      this.onSignInSuccess();
    });
  }
  private onSignInSuccess(): void {
    this.goToVerify();
  }
  goToVerify() {
    //Go to the verification page
    
    this.navCtrl.push(VerifyLocationPage);
  }
}
