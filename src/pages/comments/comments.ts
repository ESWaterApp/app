import { Component, Inject } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { FirebaseApp } from 'angularfire2';
import { ReportService } from '../services/ReportService';

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
        <button ion-button block large (click)='goHome()' color="alert">
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
  constructor(public navCtrl: NavController, private alertController: AlertController, private loadCtrl: LoadingController, @Inject(FirebaseApp) private firebaseApp: firebase.app.App, private reportService: ReportService) {
    this.loader = loadCtrl.create({
      content: "Thanks! Going to Home..."
    });
    this.db = firebaseApp.database().ref();
  }
  recordInDB() {
    this.reportService.setComments(this.text_content);
    var reportKey = this.db.child("Reports").push().key;
    var report = this.reportService.toJSON();
    this.db.child("Reports").update({[reportKey] : report});
    this.db.child("Users/" + report["User"] + "/Reports").update({[reportKey] : true});
    this.db.child("Status/Unassigned").update({[reportKey] : true});
  }
  goHome() {
    this.recordInDB();
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
      coolAlert.present();
 
    }
}
