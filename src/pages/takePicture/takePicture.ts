import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera } from 'ionic-native';

@Component({
  selector: 'page-takePicture',
  templateUrl: 'takePicture.html',
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title center>Take a Picture</ion-title>
    </ion-navbar>
  </ion-header>
  <ion-content>
    <ion-buttons>
      <button (click)='takePicture()' ion-button block large color="alert">
        Click for Camera
      </button>
    </ion-buttons>
    <ion-card>
      <ion-card-content>
        <canvas id="imgCanvas" width="500" height="400">
        </canvas>
      </ion-card-content>
    </ion-card>
  </ion-content>
  `
})

export class TakePicturePage {
  cameraOptions: {}
  constructor(public navCtrl: NavController) {
    this.cameraOptions = {
      destinationType: Camera.DestinationType.DATA_URL
    };
  }
  takePicture() {
    Camera.getPicture(this.cameraOptions).then((imageData) => {
      let base64image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log(err);
    });
  }
}
