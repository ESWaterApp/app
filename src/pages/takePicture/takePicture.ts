import { Component, ViewChild } from '@angular/core';
import { NavController, Content } from 'ionic-angular';
import { Camera } from 'ionic-native';
import { CommentsPage } from '../comments/comments';

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
      <button (click)='takePicture()' ion-button block large [color]=top_button.color>
        {{top_button.text}}
      </button>
    </ion-buttons>
    <ion-card>
      <ion-card-content id="pic_card">
        <ion-img [width]=image.width [height]=image.height [src]=image.name></ion-img>
      </ion-card-content>
    </ion-card>
    <ion-buttons>
      <button (click)='goToComments()' [hidden]=confirm ion-button block large color="alert">
        Confirm
      </button>
    </ion-buttons>
  </ion-content>
  `
})

export class TakePicturePage {
  @ViewChild(Content) content: Content;
  cameraOptions: {};
  image: {};
  top_button: {};
  confirm: boolean;

  constructor(public navCtrl: NavController) {
    this.cameraOptions = {
      destinationType: Camera.DestinationType.DATA_URL
    };
    this.image = {
      name: "",
      width: 0.0,
      height: 0.0
    }
    this.top_button = {
      text: "Click for Camera",
      color: 'alert'
    }
    this.confirm = true;
  }

  takePicture() {
    Camera.getPicture(this.cameraOptions).then((imageData) => {
      this.image = { 
        name: 'data:image/jpeg;base64,' + imageData,
        width: this.content.getContentDimensions().contentWidth * 0.75,
        height: this.content.getContentDimensions().contentHeight * 0.5
      }
      this.top_button = { text: "Try Again?", color: "danger" };
      this.showConfirm();
    }, (err) => {
      console.log(err);
    });
  }

  showConfirm() {
    this.confirm = false;
  }

  goToComments() {
    this.navCtrl.push(CommentsPage);
  }
}
