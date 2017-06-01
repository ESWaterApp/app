import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ReportService } from '../services/ReportService';
import { AuthoritiesPage } from '../authorities/authorities';

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
        <button ion-button block large (click)='goToAuthorities()' color="alert">
          Confirm
        </button>
      </ion-buttons>
    </ion-content>
  `
})

export class CommentsPage {
  text_content: string;
  constructor(public navCtrl: NavController, private reportService: ReportService) {
    this.text_content = "";
  }

  goToAuthorities() {
    this.reportService.setComments(this.text_content);
    this.navCtrl.push(AuthoritiesPage);
  }
}
