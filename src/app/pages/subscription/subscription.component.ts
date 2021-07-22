import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../core/services/common.service';
import { PaymentService } from '../../core/services/paymentService';

import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'Subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class Subscription implements OnInit {
  stripeTest: FormGroup;
  stripeTestError = {
    name: '',
    email: '',
    card: '',
  };
  plans = [];
  currentPlan = '';
  FullName = '';
  userId;
  planId;
  stripeToken;
  planPrice;
  mainPrice;
  planDuration;
  plandata: any;
  stripeId: any;
  userData: any;
  coupon;
  couponData: any;
  couponMessage = null;
  discount = null;
  // stripe
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: 'red',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };


  paymentFormvalidationMessages = {
    name: {
      required: 'Name is required',
      minlength: 'minimum 3 characters required'
    },
    email: {
      required: 'email is required',
      pattern: 'email not in valid format'
    },
    card: {
      required: 'card number is required',
      minlength: 'minimum 16 digit required',
      maxlength: 'minimum 16 digit required'
    }
  };


  //
  constructor(private commonService: CommonService,
              private router: Router,
              private paymentService: PaymentService,
              private fb: FormBuilder,
              private stripeService: StripeService,
              private spinner: NgxSpinnerService) { }
  ngOnInit(): void {
    //
    this.getPlans();
    // this.paymentForm()
    this.getUser();
    this.getTransparentPricing();
    console.log('stripe', this.coupon.length);
    if (this.coupon.length >= 0) {
      this.discount = null;
    }
  }


  paymentForm() {
    this.stripeTest = this.fb.group({
      name: [this.userData ? this.userData.FullName : '', [Validators.required, Validators.minLength(3)]],
      email: [this.userData ? this.userData.email : '', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      card: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16),]],
      coupon: ['']
    });
    this.stripeTest.valueChanges.subscribe(data => this.onValueChanges(data));

  }
  applyCoupon() {
    // alert(this.stripeTest.value('coupon'))
    let data = {
      couponId: this.stripeTest.value.coupon
    };
    console.log('data ', this.stripeTest.value.coupon);
    this.commonService.post(`getCoupons`, data).subscribe((data: any) => {
      console.log('plandata.currentPlan.noteUsage', data)

      if (data.status == 200) {
        this.couponData = data.data
        this.discount = (this.couponData.percent_off / 100) * this.planPrice
        console.log('plandata.currentPlan', this.discount, this.couponData.percent_off)
        this.planPrice = this.planPrice - this.discount
        this.couponMessage = null
        document.getElementById('coupon').setAttribute('readonly', 'true');

      }
      if (data.status == 404) {
        this.discount = null
        this.couponMessage = 'Invalid Coupon code'
      }
    });
  }
  cancleCoupon() {
    this.discount = null;
    this.stripeTest.value.coupon = null;
    $('input[name=coupon]').val('');
    this.planPrice = this.mainPrice;
    document.getElementById('coupon').removeAttribute('readonly');

    // document.getElementById("coupon").reset();
  }
  onValueChanges(data?: any) {
    if (!this.stripeTest)
      return;
    const form = this.stripeTest;
    for (const field in this.stripeTestError) {
      if (this.stripeTestError.hasOwnProperty(field)) {
        this.stripeTestError[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.paymentFormvalidationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.stripeTestError[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
  getUser() {
    this.commonService.get(`getUser`).subscribe((data: any) => {
      if (data.status == 200) {
        this.currentPlan = data.result.currentPlan
        this.userId = data.result.id
        this.FullName = data.result.fullName
        this.userData = data.result
        this.paymentForm()
        console.log('userdata', this.userData)
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
        // console.log("plandata.currentPlan.noteUsage", this.plandata.currentPlan.noteUsage)
      }
    });
  }
  getPlans() {
    this.commonService.get(`getSubscriptionPlan`).subscribe((data: any) => {
      // console.log(data)
      if (data.result.length > 0) {
        console.log('data', data)
        this.plans = data.result
        setTimeout(() => {
          document.getElementById(this.currentPlan).classList.add('PayButton')
        }, 500);
      } else {
        this.plans = []
      }
    });
  }
  onChoosePlan(id, price, duration, stripeId, planName) {
    console.log(this.userData,);

    this.planId = id;
    this.planPrice = price;
    this.mainPrice = price;
    this.planDuration = duration;
    this.stripeId = stripeId;
    let data = {
      userId: this.userId,
      userName: this.FullName,
      // email:this.
      planId: id,
      planPrice: price,
      mainPrice: price,
      planDuration: duration,
      planName: planName,
      stripeId: stripeId,
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
      email: this.userData.email
    };
    this.paymentService.paymentService(data);
    this.router.navigate(['payment']);

  }
  onPayment() {
    let body = {
      userId: this.userId,
      amount: this.planPrice,
    };
    console.log('payment data', body);
    this.commonService.post(`payment`, body).subscribe((data: any) => {
      // console.log(data)
      if (data.data.length > 0) {
        console.log('paymen responce', data)
        // this.onSubscription()
      } else {
        this.spinner.hide();
      }
    });
  }
  createToken(): void {
    console.log(this.stripeTest.value, this.card.element);
    this.spinner.show();
    const name = this.stripeTest.get('name').value;
    const email = this.stripeTest.get('name').value;

    this.stripeService
      .createToken(this.card.element, { name, })
      .subscribe((result) => {
        if (result.token) {
          this.onpaymentDone(result);
        } else if (result.error) {
          console.log('error', result.error.message);
          Swal.fire('ohh snap!',
            'card not valid!',
            'error');
          this.spinner.hide();

        }
      });
  }
  onpaymentDone(result) {
    let body = {
      stripeToken: result.token.id,
      planPrice: this.planPrice,
      subscriptionId: this.planId,
      planDuration: this.planDuration,
      stripePlanId: this.stripeId,
      couponId: this.stripeTest.value.coupon
    };
    console.log('payment data', body);
    this.commonService.post(`create-payment`, body).subscribe((data: any) => {
      // console.log(data)
      this.spinner.hide();
      document.getElementById('onPay').click();
      if (data.status == 200) {
        console.log('paymen responce', data)
        Swal.fire('Hurray!!',
          'Your subscription begins now!!',
          'success');
        document.getElementById(this.currentPlan).classList.remove('PayButton')

        this.getUser()
      }
      else if (data.status == 400) {
        Swal.fire(
          'something went wrong!!',
          'error');
      }
      else {
        this.spinner.hide();
      }
    });
  }
  // onSubscription() {

  //   let body = {
  //     "userId": this.userId,
  //     "subscriptionId": this.planId,
  //     "planDuration": this.planDuration
  //   }
  //   console.log("data,body", body)

  //   this.commonService.post(`subscribePlan`, body).subscribe((data: any) => {
  //     console.log("data,data0", data)
  //     if (data.status == 200) {
  //       console.log("data", data)

  //     } else {
  //       this.spinner.hide();
  //       document.getElementById("onPay").click();
  //     }
  //   })
  // }

  // onpaymentStore(result) {
  //   let body = {
  //     userId: this.userId,
  //     token: result.token.id,
  //     subscriptionId: this.planId,
  //     status: "success",
  //     amount: this.planPrice,
  //   }
  //   console.log("payment data", body)
  //   this.commonService.post(`payment`, body).subscribe((data: any) => {
  //     // console.log(data)
  //     if (data.status == 200) {
  //       console.log("paymen responce", data)
  //       this.onSubscription()
  //     } else {
  //       this.spinner.hide();
  //     }
  //   })
  // }
  onCancel(planId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once Cancel, you need to subscribe again!',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes!'
    })
      .then((willDelete) => {
        if (willDelete.value) {
          this.planCancel(planId);
        } else {
          // Swal.fire("Fail");
        }
        console.log(willDelete);
      });
  }
  planCancel(planId) {
    let body = {
      planStatus: 1,
      subscriptionId: planId
    };
    this.commonService.post(`planCancel`, body).subscribe((data: any) => {
      // console.log(data)
      if (data.status == 200) {
        this.getUser()
        Swal.fire('subscription Cancel!',
          'You need to subscription again.',
          'success');
        document.getElementById(this.currentPlan).classList.remove('PayButton')

      }
      else if (data.status == 400) {
        Swal.fire('Ohhhh Snap',
          `Something went Wrong!!!`,
          'error');
      }
      else {
        this.spinner.hide();
      }
    });
  }

}
