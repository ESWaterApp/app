import {Injectable} from "@angular/core";
declare var google;
@Injectable()
export class Geocoder {
  private geocoder: any;
  private location: string;
  constructor() {
    this.geocoder = new google.maps.Geocoder;
  }
  setAddress(lat: number, lng: number): Promise<any> {
    let latLng = {"lat": lat, "lng": lng};
    return new Promise((resolve, reject) => {
      this.geocoder.geocode({"location": latLng}, (results, status) => {
        if(status === "OK" && results) {
          this.location = results[0].formatted_address;
          resolve(this.location);
        } else
          reject(status);
      });
    });
  }
  getAddress() {
    return this.location;
  }
}
