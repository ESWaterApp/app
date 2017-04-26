import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { TakePicturePage } from '../takePicture/takePicture'
import { ReportService } from '../services/ReportService';
declare var google;

@Component({
  selector: 'page-verifyLocation',
  templateUrl: 'verifyLocation.html',
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title center>Verify Location</ion-title>
    </ion-navbar>
  </ion-header>
  <ion-content>
    <h1 id="verifyLocation-heading1" style="color:#000000;text-align:center;">Move the Marker to Your Location</h1>
    <div #map id="map"></div>
    <ion-buttons>
      <button (click)='goToPicture()' ion-button block large color="positive">
        Confirm and Continue
      </button>
    </ion-buttons>
  </ion-content>
  `
})

export class VerifyLocationPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  marker: any;
  constructor(public navCtrl: NavController, private reportService: ReportService) {
  }

  ionViewDidLoad () {
    this.loadMap().then(() => {
      this.addMarker();
    }, (err) => {
      console.log(err);
    });
  }

  loadMap() {
    return Geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 30,
        mapTypeId: google.maps.MapTypeId.SATELLITE
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    }, (err) => {
      throw err;
    });
  }
  
  addMarker() {
    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter(),
      draggable: true
    });
    
    let content = "<h4>Your location.</h4>";
   
    this.addInfoWindow(this.marker, content);
  }

  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
   
    infoWindow.open(this.map, marker);
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  goToPicture() {
    this.reportService.setLocation(this.marker.position);
    this.navCtrl.push(TakePicturePage);
  }
}
