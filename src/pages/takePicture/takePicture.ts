import { Component, ViewChild, Inject } from '@angular/core';
import { NavController, Content, AlertController } from 'ionic-angular';
import { Camera } from 'ionic-native';
import { CommentsPage } from '../comments/comments';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';
import * as hash_it from 'hash-it';

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
        {{this.confirm_text}}
      </button>
    </ion-buttons>
  </ion-content>
  `
})

export class TakePicturePage {
  @ViewChild(Content) content: Content;
  cameraOptions: {};
  image: any;
  top_button: {};
  storage: firebase.storage.Reference;
  confirm: boolean;
  confirm_text: string;

  constructor(public navCtrl: NavController,@Inject(FirebaseApp) public firebaseApp: firebase.app.App, private alertController: AlertController) {
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
    this.confirm_text = "Confirm";
    this.storage = this.firebaseApp.storage().ref();
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
    var file_name = hash_it(this.image.name);
    this.storage.child('Images/' + file_name).putString(this.image.name, 'data_url').then((snapshot) => {
        this.navCtrl.push(CommentsPage);
    }, (err) => {
        this.displayAlert(err.message, "Failure Loading Image");
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
