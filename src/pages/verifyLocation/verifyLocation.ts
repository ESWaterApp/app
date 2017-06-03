import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { Geocoder } from '../services/Geocoder';
import { Keyboard } from '@ionic-native/keyboard';
import { TakePicturePage } from '../takePicture/takePicture'
import { ReportService } from '../services/ReportService';
import { DisplayService } from '../services/DisplayService';
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
    <h1 id="verifyLocation-heading1" style="color:#000000;text-align:center;">Give Your Location</h1>
    <ion-searchbar id="search" [(ngModel)]="address"></ion-searchbar>
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
  @ViewChild('search') searchElement: ElementRef;
  map: any;
  marker: any;
  infoWindow: any;
  address: any = "";
  autocomplete: any;
  constructor(public navCtrl: NavController, private reportService: ReportService, private geocoder: Geocoder, private keyboard: Keyboard, private displayService: DisplayService) {
  }
  ionViewDidLoad () {
    Promise.all(
      [this.initSearch(),
       this.loadMap()]
    ).then((vals) => {
      this.addMarker();
    }, (err) => {
      console.log(err);
    });
  }
  initSearch(): Promise<any> {
    return new Promise((resolve) => {
      this.autocomplete = new google.maps.places.Autocomplete(document.getElementById('search').getElementsByClassName('searchbar-input')[0]);
      this.autocomplete.addListener('place_changed', () => {
        this.keyboard.close();
        this.infoWindow.close();
        this.marker.setVisible(false);
        let place = this.autocomplete.getPlace();
        if(!place.geometry) {
          this.marker.setVisible(true);
          this.displayService.displayAlert("Please enter a valid location", "Invalid Location");
          return;
        }
        this.map.setCenter(place.geometry.location);
        this.marker.setPosition(place.geometry.location);
        this.setInfoWindowContent(this.marker);
        this.marker.setVisible(true);
        this.infoWindow.open(this.map, this.marker);
      });
      resolve(this.autocomplete);
    });
  }
  loadMap(): Promise<any>{
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition().then((position) => {
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        let mapOptions = {
          center: latLng,
          zoom: 18,
          mapTypeId: google.maps.MapTypeId.SATELLITE
        }
      
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        resolve(this.geocoder.setAddress(position.coords.latitude, position.coords.longitude));
      }, (err) => {
        reject(err);
      });
    });
  }
  
  addMarker() {
    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter(),
      draggable: true
    }); 
    this.addInfoWindow(this.marker, this.geocoder.getAddress());
  }
  addInfoWindow(marker, content) {
    this.infoWindow = new google.maps.InfoWindow({
      content: content
    });
   
    this.infoWindow.open(this.map, marker);
    google.maps.event.addListener(marker, 'click', () => {
      this.infoWindow.open(this.map, marker);
    });
    google.maps.event.addListener(marker, 'dragend', () => {
      this.setInfoWindowContent(marker);
    });
  }
  setInfoWindowContent(marker: any) {
    this.geocoder.setAddress(marker.position.lat(), marker.position.lng()).then((location) => {
      this.infoWindow.setContent(location);
    });
  }
  goToPicture() {
    this.reportService.setLocation(this.marker.position);
    this.reportService.setLocationName(this.infoWindow.getContent());
    this.navCtrl.push(TakePicturePage);
  }
}
