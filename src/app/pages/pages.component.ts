import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxFreshChatService } from 'ngx-freshchat';
import { CommonService } from '../core/services/common.service';

@Component({
  selector: 'app-pages',
  // template: `
  // <app-header *ngIf="!(router === '/login'|| router === '/reset-password'|| router === '/create-agent-profile'|| router ==='/register')"></app-header>
  // <router-outlet></router-outlet>
  // <app-footer *ngIf="!(router === '/login'|| router === '/reset-password'|| router === '/create-agent-profile'|| router ==='/register')"></app-footer>
  // `,
  template: `
  <router-outlet></router-outlet>
  `,
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  router: string;
userData: any;
  constructor(private _router: Router,private chat: NgxFreshChatService,private commonService: CommonService) {
    this.router = this._router.url;
  }

  ngOnInit(): void {
    this.getUser()


  }
//
getUser() {
  this.commonService.get(`getUser`).subscribe((data: any) => {
    if (data.status == 200) {
      this.userData = data.result
      console.log("userdata",this.userData)
      this.freshchat()
    }
  })
}
freshchat(){
  if(!localStorage.getItem('token'))
  this._router.navigate(['login'])
   this.chat.init({
    token: "2f2a659d-8808-415b-bb13-c5d84d9ead03",
    host: "https://wchat.freshchat.com",
    externalId:this.userData.id,
    firstName: this.userData.FullName,
    email:this.userData.email
})
.subscribe(
    () => console.log('FreshChat is ready!')
);

}
}
