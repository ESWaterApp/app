import {Injectable} from "@angular/core";
import { AlertController } from 'ionic-angular';
@Injectable()
export class DisplayService {
  constructor(public alertCtrl: AlertController) {
  }
  displayAlert(value: any,title: string)
  {
    value = JSON.stringify(value);
    let coolAlert = this.alertCtrl.create({
      title: title,
      message: value,
      buttons: [
                    {
                        text: "OK"
                    }
               ]
      });
      coolAlert.present();
      return new Promise((resolve) => {
        coolAlert.onDidDismiss((val) => {
          resolve(val);
        });
      });
  }
}
