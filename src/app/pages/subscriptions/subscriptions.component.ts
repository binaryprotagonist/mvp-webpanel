import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { NgxSpinnerService } from 'ngx-spinner';
import { StripeCardComponent, StripeService } from 'ngx-stripe';
import { CommonService, PaymentService } from 'src/app/core/services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {

  constructor(private commonService: CommonService,
    private router: Router,
    private paymentService: PaymentService,
    private fb: FormBuilder,
    private stripeService: StripeService,
    private spinner: NgxSpinnerService) { }

  plans = [];
  currentPlan = '';
  userId;
  plandata: any;
  userData: any;

  ngOnInit(): void {
    this.getPlans();
    this.getUser();
    this.getTransparentPricing();
  }
  getUser() {
    this.commonService.get(`getUser`).subscribe((data: any) => {
      if (data.status == 200) {
        this.currentPlan = data.result.currentPlan
        this.userId = data.result.id
        this.userData = data.result
        setTimeout(() => {
          document.getElementById(this.currentPlan).classList.add('PayButton')
        }, 1000);
      }
    });
  }
  getTransparentPricing() {
    this.commonService.get(`getTransparentPricing`).subscribe((data: any) => {
      if (data.status == 200) {
        this.plandata = data.result
      }
    });
  }
  getPlans() {
    this.commonService.get(`getSubscriptionPlan`).subscribe((data: any) => {
      if (data.result.length > 0) {
        this.plans = data.result
        setTimeout(() => {
          document.getElementById(this.currentPlan).classList.add('PayButton')
        }, 500);
      }
    });
  }
  onChoosePlan(plan) { 
    console.log(plan);
    const body = {
      planName: plan.planName,
      planPrice: plan.planPrice,
      planDuration: plan.planDuration,
      subscriptionId: plan._id,
      stripePlanId: plan.stripeData.planId,
      stripePriceId: plan.stripeData.priceId
    }
    this.commonService.post('checkoutApi', body).subscribe((data: any) => {
      console.log(data);
      open(data.data);
    })
  }
  onCancel(planId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once Cancel, you need to subscribe again!',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes'
    })
    .then((willDelete) => {
      if (willDelete.value) {
        this.planCancel(planId);
      }
    });
  }
  planCancel(planId) {
    let body = {
      planStatus: 1,
      subscriptionId: planId
    };
    this.commonService.post(`planCancel`, body).subscribe((data: any) => {
      this.spinner.hide();
      if (data.status == 200) {
        this.getUser()
        Swal.fire('Ssubscription cancel', 'You need to subscription again.', 'success');
        document.getElementById(this.currentPlan).classList.remove('PayButton')
      }
      if (data.status == 400) {
        Swal.fire('Oh Snap', `Something went Wrong!`, 'error');
      }
    }, (error) => {
      this.spinner.hide();
      Swal.fire('Oh Snap', `Something went Wrong!`, 'error');
    });
  }

}
