import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

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
      <ion-textarea fz-elastic placeholder="Please Be Detailed!"></ion-textarea>
      <ion-buttons>
        <button ion-button block large (click)='goHome()' color="alert">
          Confirm
        </button>
      </ion-buttons>
    </ion-content>
  `
})

export class CommentsPage {
  constructor(public navCtrl: NavController, private alertController: AlertController) {
  }
  goHome() {
    this.displayAlert("Going to Home...", "Thanks!");
    setTimeout(() => {
      this.navCtrl.popToRoot();
    }, 2000);
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
