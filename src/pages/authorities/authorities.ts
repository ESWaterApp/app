import { Component, Inject } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { FirebaseApp } from 'angularfire2';
import { ReportService } from '../services/ReportService';
import { DisplayService } from '../services/DisplayService';
import { SocialSharing } from '@ionic-native/social-sharing';
import * as moment from 'moment';

@Component({
  selector: 'page-authorities',
  templateUrl: 'authorities.html',
  template: `
  <ion-header>
      <ion-navbar>
        <ion-title center>Select Authority</ion-title>
      </ion-navbar>
  </ion-header>
  <ion-content>
    <ion-list>
      <ion-item-sliding *ngFor="let authority of authorities">
        <ion-item>
          <ion-avatar item-left>
            <img [src]=authority.image>
          </ion-avatar>
          <h2 [innerText]=authority.title></h2>
          <p [innerText]=authority.email></p>
        </ion-item>
        <ion-item-options icon-left>
          <button ion-button color="secondary" (click)="commitReport(authority)">
            <ion-icon name="mail"></ion-icon>
            Email
          </button>
        </ion-item-options>
      </ion-item-sliding>
    </ion-list>
  </ion-content>
  `
})

export class AuthoritiesPage {
  loader: any;
  authorities: any = [];

  constructor(public navCtrl: NavController, @Inject(FirebaseApp) private firebaseApp: firebase.app.App, private reportService: ReportService, private socialSharing: SocialSharing, public loadCtrl: LoadingController, public alertController: AlertController, private displayService: DisplayService) {
    this.loader = loadCtrl.create({
      content: "Thanks! Going to Home..."
    });
  }

  ionViewDidLoad() {
    var db = this.getDBConn();
    db.child("Authorities").orderByKey().once("value").then((data) => {
      var authoritiesJSON = data.toJSON();
      var authorityRef = this.firebaseApp.storage().refFromURL("gs://waterapp-effd4.appspot.com/Authority_Icons/");
      for(var key in authoritiesJSON) {
        this.setAuthority(authorityRef, key, authoritiesJSON).then((json) => {
          this.authorities.push(json);
        });
      }
    });
  }

  recordInDB() {
    this.reportService.setDatetime(moment().format('LLLL'));
    var db = this.getDBConn();
    var reportKey = db.child("Reports").push().key;
    var report = this.reportService.toJSON();
    try {
      db.child("Reports").update({[reportKey] : report});
      db.child("Users/" + report["User"] + "/Reports").update({[reportKey] : true});
      db.child("Status/Unassigned").update({[reportKey] : true});
    } catch(error) {
      this.displayService.displayAlert(error, "Error");
    }
    return report;
  }

  sendEmail(report: {}, recipient: string) {
    var subject = "Report from " + report["User"];
    var body = 
    "Comments:\n" + report["Comments"] +
    "\nLocation (Google Maps Link): \nhttps://www.google.com/maps/@" + report["Location"]["lat"] + "," + report["Location"]["lng"] +",15z\n";
    return this.firebaseApp.storage().ref("Images/" + report["ImageID"]).getDownloadURL().then((val) => {
      body += "Image Link (Firebase Storage Download Link):\n" + val + "\n"
      return this.socialSharing.shareViaEmail(body, subject, [recipient], [], [], []);
    }, (err) => {
      body += "Image Unavailable.\n";
      return this.socialSharing.shareViaEmail(body, subject, [recipient], [], [], []);
    });
  }

  commitReport(auth: any) {
    this.reportService.setAuthority(auth.title);
    var report = this.recordInDB();
    this.socialSharing.canShareViaEmail().then((val) => {
      this.sendEmail(report, auth["email"]).then((emailPromise) => {
        this.goHome();
      }, (err) => {
        this.goHome();
      });
    }, (err) => {
      this.displayService.displayAlert(err + "\nOK to continue.", "Gmail Unavailable.").then((val) => {
        this.goHome();
      });
    });
  }

  goHome() {
    this.loader.present();
    this.navCtrl.popToRoot().then((value) => {
      this.loader.dismiss();
    }, (err) => {
      this.loader.dismiss();
      this.displayService.displayAlert(err, "Failure Going to Home");
    });
  }

  setAuthority(authorityRef, key, authoritiesJSON) {
    return new Promise((resolve, reject) => {
      authorityRef.child(authoritiesJSON[key]["Image"] + ".png").getDownloadURL().then((url) => {
        resolve({ "title": key, "email": authoritiesJSON[key]["Email"], "image": url });
      }, (err) => {
        reject(err);
      });
    });
  }

  getDBConn() {
    return this.firebaseApp.database().ref();
  }
}
