import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  template: `
    <h1>Login</h1>
    <form [formGroup]="userLogin" (ngSubmit)="login()">
      <ion-item>
        <ion-label>Email</ion-label>
        <ion-input type="email" formControlName="email"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label>Password</ion-label>
        <ion-input type="text" formControlName="password"></ion-input>
      </ion-item>
      <button (click)="close()" ion-button type="submit">Submit</button>
    </form>
  `
})
export class LoginPopover {
  private userLogin : FormGroup;
  constructor(public viewCtrl: ViewController, private formBuilder: FormBuilder) {
    this.userLogin = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['']
    })
  }
  login() {
    console.log("login");
  }
  close() {
    this.viewCtrl.dismiss();
  }
}
