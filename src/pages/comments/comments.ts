import { Component, Inject } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { FirebaseApp } from 'angularfire2';
import { ReportService } from '../services/ReportService';
import { SocialSharing } from '@ionic-native/social-sharing';
import * as moment from 'moment';

@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title center>Additional Comments</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content>
      <h1 class="heading">Something Else to Add?</h1>
      <ion-textarea [(ngModel)]="text_content" fz-elastic placeholder="Please Be Detailed!"></ion-textarea>
      <ion-buttons>
        <button ion-button block large (click)='commitReport()' color="alert">
          Confirm
        </button>
      </ion-buttons>
    </ion-content>
  `
})

export class CommentsPage {
  loader: any;
  text_content: string;
  db: firebase.database.Reference;
  recipient_addr: string;
  constructor(public navCtrl: NavController, private alertController: AlertController, private loadCtrl: LoadingController, @Inject(FirebaseApp) private firebaseApp: firebase.app.App, private reportService: ReportService, private socialSharing: SocialSharing) {
    this.loader = loadCtrl.create({
      content: "Thanks! Going to Home..."
    });
    this.db = firebaseApp.database().ref();
    this.recipient_addr = 'waterappemails@gmail.com';
  }
  recordInDB() {
    this.reportService.setComments(this.text_content);
    this.reportService.setDatetime(moment().format('LLLL'));
    var reportKey = this.db.child("Reports").push().key;
    var report = this.reportService.toJSON();
    this.db.child("Reports").update({[reportKey] : report});
    this.db.child("Users/" + report["User"] + "/Reports").update({[reportKey] : true});
    this.db.child("Status/Unassigned").update({[reportKey] : true});
    return report;
  }
  sendEmail(report: {}) {
    var subject = "Report from " + report["User"];
    var body = "Location: https://www.google.com/maps/@" + report["Location"]["lat"] + "," + report["Location"]["lng"] +",15z \n"
    + "Comments: " + report["Comments"];
    var attachments = this.reportService.getImageURL();
    return this.socialSharing.shareViaEmail(body, subject, [this.recipient_addr], [], [], [attachments]);
  }
  commitReport() {
    var report = this.recordInDB();
    this.socialSharing.canShareViaEmail().then((val) => {
      this.sendEmail(report).then((val) => {
        this.goHome();
      }, (err) => {
        this.displayAlert(err + "\nOK to continue.", "Email Failure. Not Sent.").then((val) => {
          this.goHome();
        });
      });
    }, (err) => {
      this.displayAlert(err + "\nOK to continue.", "Gmail Unavailable.").then((val) => {
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
      this.displayAlert(err, "Failure Going to Home");
    });
  }

  displayAlert(value: string,title: string) {
      let coolAlert = this.alertController.create({
      title: title,
      message: value,
      buttons: [
                    {
                        text: "OK"
                    }
               ]
      });
      return coolAlert.present();
    }
}
