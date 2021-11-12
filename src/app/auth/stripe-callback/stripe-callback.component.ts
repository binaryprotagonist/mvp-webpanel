import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stripe-callback',
  templateUrl: './stripe-callback.component.html',
  styleUrls: ['./stripe-callback.component.css']
})
export class StripeCallbackComponent implements OnInit {

  constructor() { }

  subscriptionSuccess = true;
  subscriptionFailed = false;
  response = false;
  successMessage = 'Redirecting to subscriptions page in 3 seconds'
  errorMessage = ''
  ngOnInit(): void {
  }

}
