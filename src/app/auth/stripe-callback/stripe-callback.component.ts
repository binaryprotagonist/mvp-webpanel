import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stripe-callback',
  templateUrl: './stripe-callback.component.html',
  styleUrls: ['./stripe-callback.component.css']
})
export class StripeCallbackComponent implements OnInit {

  constructor(private router: Router) { }

  subscriptionSuccess = true;
  subscriptionFailed = false;
  response = false;
  successMessage = 'Redirecting to subscriptions page in 3 seconds'
  errorMessage = ''
  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['subscription']);
    }, 3000);
  }

}
