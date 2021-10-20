import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxFreshChatService } from 'ngx-freshchat';
import { CommonService } from '../core/services/common.service';
import * as moment from 'moment';

@Component({
  selector: 'app-pages',
  template: `
    <ng-container>
      <app-verify-email-reminder [show]='showVerifyNotification' [days]='days'></app-verify-email-reminder>
    </ng-container>
    <router-outlet></router-outlet>
  `,
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  router: string;
  userData: any;
  days = 0;
  showVerifyNotification = false;
  constructor(private _router: Router, private chat: NgxFreshChatService, private commonService: CommonService) {
    this.router = this._router.url;
  }

  ngOnInit(): void {
    this.getUser();
  }
  getUser(): void {
    if (!localStorage.getItem('token')) {
      this._router.navigate(['login']);
      return;
    }
    this.commonService.get(`getUser`).subscribe((data: any) => {
      if (data.status == 200) {
        this.userData = data.result;
        if (!this.userData.isveify) {
          this.showVerifyNotification = true;
          const createdAt = moment(this.userData.createdAt);
          const currentDay = moment().add(1, 'second');
          this.days = 7 - currentDay.diff(createdAt, 'days');
          if (this.days < 0) {
            localStorage.removeItem('token');
            this._router.navigate(['/login']);
          }
        }
        this.freshchat();
      }
    });
  }
  freshchat(): void {
    this.chat.init({
      token: '2f2a659d-8808-415b-bb13-c5d84d9ead03',
      host: 'https://wchat.freshchat.com',
      externalId: this.userData.id,
      firstName: this.userData.FullName,
      email: this.userData.email
    }).subscribe();
  }
}
