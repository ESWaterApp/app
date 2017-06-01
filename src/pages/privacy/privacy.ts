import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { DisplayService } from '../services/DisplayService';

@Component({
  selector: 'page-privacy',
  templateUrl: 'privacy.html',
  template: `
    <ion-content class= 'padding'>
      <ion-grid>
        <ion-card>
          <ion-card-content>
            <ion-card-header>
              Privacy Policy
            </ion-card-header>
            <ion-row height-90 align-items-start>
              <iframe class= 'webPage' name= "eventsPage" src="https://www.iubenda.com/privacy-policy/8136276">
              </iframe>
            </ion-row>
            <ion-row justify-content-center align-items-center>
              <button ion-button (click)="close('success')" color="secondary">
                I Agree to the Privacy Policy.
              </button>
            </ion-row>
            <ion-row justify-content-center align-items-end>
              <button ion-button (click)="close('failure')" color="danger">
                I Do Not Agree
              </button>
            </ion-row>
          </ion-card-content>
        </ion-card>
      </ion-grid>
    </ion-content>
  `
})

export class PrivacyPage {
  constructor(public viewCtrl: ViewController, private displayService: DisplayService) {
  }
  close(flag: string) {
    if (flag === "failure")
      this.displayService.displayAlert("Because you did not agree to the the Privacy Policy, you will not be able to use any further services of this app. Please now uninstall the app.", "User Did Not Consent")
      .then((val) => {;
        this.viewCtrl.dismiss(flag);
      }).catch((val) => {
        this.viewCtrl.dismiss(flag);
      });
    else 
      this.viewCtrl.dismiss(flag);
  }
}
