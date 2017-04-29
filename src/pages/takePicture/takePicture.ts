import { Component, ViewChild, Inject } from '@angular/core';
import { NavController, Content, AlertController, LoadingController } from 'ionic-angular';
import { Camera } from 'ionic-native';
import { CommentsPage } from '../comments/comments';
import { FirebaseApp } from 'angularfire2';
import { ReportService } from '../services/ReportService';
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
        Confirm
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
  loader: any;

  constructor(public navCtrl: NavController,@Inject(FirebaseApp) private firebaseApp: firebase.app.App, private alertController: AlertController, private loadCtrl: LoadingController, private reportService: ReportService) {
    this.cameraOptions = {
      destinationType: Camera.DestinationType.DATA_URL
    };
    this.top_button = {
      text: "Click for Camera",
      color: 'alert'
    }
    this.image = {
      name: "",
      width: 0.0,
      height: 0.0
    }
    this.confirm = true;
    this.storage = this.firebaseApp.storage().ref();
    this.loader = loadCtrl.create({
      content: "Loading Image..."
    });
  }

  ionViewDidLoad() {
    this.image = {
      name: "assets/img/broken_sprinkler.jpg",
      width: 300,
      height: 300
    }
  }

  takePicture() {
    Camera.getPicture(this.cameraOptions).then((imageData) => {
      this.image = {
        name: 'data:image/jpeg;base64,' + imageData,
        width: this.content.getContentDimensions().contentWidth * 0.75,
        height: this.content.getContentDimensions().contentHeight * 0.5
      };
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
    this.loader.present();
    this.storage.child('Images/' + file_name).putString(this.image.name, 'data_url').then((snapshot) => {
        this.reportService.setImageId(file_name);
        this.loader.dismiss();
        this.navCtrl.push(CommentsPage);
        this.reportService.setImageURL(this.image.name);
    }, (err) => {
        this.loader.dismiss();
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
