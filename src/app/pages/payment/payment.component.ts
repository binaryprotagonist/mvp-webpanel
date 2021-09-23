import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../core/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PaymentService } from '../../core/services/paymentService';
import { CountryName } from '../../core/services/country'
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import { Router } from '@angular/router';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-trash',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
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

  stripeTest: FormGroup;
  stripeTestError = {
    'firstName': '',
    'email': '',
    'lastName': '',
    'card': '',
    'postal': '',
    'city': '',
    'apartment': '',
    'streetAddress': '',
    'expMonth': '',
    'expYear': '',
    'cvc': '',
    'country': ''
  }
  months=[1,2,3,4,5,6,7,8,9,10,11,12]
  years=[2021,2022,2023,2024,2025,2026,2027,2028,2029]
  userData
  planData;
  countrys
  planPrice
  selectedCountry
  coupon
  couponData: any
  couponMessage = null
  discount = null
  mainPrice
  couponId: any
  countryList: any
  cardMessage:any

  paymentFormvalidationMessages = {
    'firstName': {
      'required': 'first name is required',
      'minlength': 'minimum 3 characters required'
    },
    'lastName': {
      'required': 'first name is required',
      'minlength': 'minimum 3 characters required'
    },
    'email': {
      'required': 'email is required',
      'pattern': 'email not in valid format'
    },
  }

  constructor(private commonService: CommonService, private router: Router, private stripeService: StripeService, private fb: FormBuilder, private spinner: NgxSpinnerService, private PaymentService: PaymentService, private CountryList: CountryName) { }

  ngOnInit(): void {
    this.getPaymentData()
    this.paymentForm();
  }

  async getPaymentData() {
    const data = this.PaymentService.getPaymentData();
    if (!data) {
      this.router.navigate(['/subscription']);
    }
    else {
      this.planData = data
      this.planPrice = data.planPrice
      this.countryList = this.CountryList.getCountry()
      this.paymentForm()
    }
  }
  applyCoupon() {
    let data = {
      couponId: this.stripeTest.value.coupon
    }
    this.commonService.post(`getCoupons`, data).subscribe((data: any) => {
      console.log('plandata.currentPlan.noteUsage', data)

      if (data.status == 200) {
        this.couponData = data.data
        this.discount = (this.couponData.percent_off / 100) * this.planPrice
        console.log('plandata.currentPlan', this.discount, this.couponData.percent_off)
        this.planPrice = this.planPrice - this.discount
        this.couponMessage = null
        this.couponId = this.stripeTest.value.coupon
        document.getElementById('coupon').setAttribute('readonly', 'true');
      }
      if (data.status == 404) {
        this.discount = null
        this.couponId = ''
        this.couponMessage = 'Invalid Coupon code';
        setTimeout(() => this.couponMessage = null, 2500);
      }
    })
  }
  cancleCoupon() {
    this.discount = null
    this.stripeTest.value.coupon = null
    $('input[name=coupon]').val('')
    this.planPrice = this.mainPrice
    document.getElementById('coupon').removeAttribute('readonly');
    this.couponId = ''
    // document.getElementById("coupon").reset();
  }

  paymentForm() {
    this.stripeTest = this.fb.group({
      firstName: [this.planData?.firstName || null, [Validators.required]],
      lastName: [this.planData?.lastName  || null, [Validators.required]],
      email: [this.planData?.email  || null, [Validators.required]],
      coupon: ['']
    })
    this.stripeTest.valueChanges.subscribe(data => this.onValueChanges(data))
    console.log(this.stripeTest.value)
  }
  onValueChanges(data?: any) {
    if (!this.stripeTest)
      return
    const form = this.stripeTest;
    for (const field in this.stripeTestError) {
      if (this.stripeTestError.hasOwnProperty(field)) {
        this.stripeTestError[field] = '';
        const control = form.get(field);
        if (control && !control.valid && (control.dirty || control.touched)) {
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

  onpaymentDone(token) {
    let body = {
      planPrice: this.planPrice,
      subscriptionId: this.planData.subscriptionId,
      planDuration: this.planData.planDuration,
      stripePlanId: this.planData.stripePlanId,
      planName: this.planData.planName,
      couponId: this.couponId,
      token:token.id,
      email: this.planData.email,
      fullName: this.planData.firstName + ' ' + this.planData.lastName
    }
    this.commonService.post(`create-payment`, body).subscribe((data: any) => {
      this.spinner.hide();
      if (data.status == 200) {
        console.log('paymen responce', data)
        Swal.fire(
          {
            title: 'Success',
            text: 'Plan subscription successfull',
            didClose: () => {
              this.router.navigate(['subscription']);
            }
          }
        );
      }
      else if (data.status == 400) {
        Swal.fire(
          'something went wrong!!',
          'error');
      }
      else if (data.status == 402) {
        Swal.fire(
          'something went wrong!!',
          'error');
      }
      else {
        this.spinner.hide();
      }
    }, (error) => {
      console.error(error);
      this.spinner.hide();
    });
  }

  createToken(){
    if (this.stripeTest.invalid) {
      this.stripeTest.markAllAsTouched()
      this.onValueChanges()
      return;
    }
    const name = this.stripeTest.value.firstName + " " +  this.stripeTest.value.lastName;
    this.spinner.show();
    this.stripeService
    .createToken(this.card.element, {name})
    .subscribe((result) => {
      if (result.token) {
        this.onpaymentDone(result.token)
      } else if (result.error) {
        console.log('error', result.error.message);
        Swal.fire('ohh snap!', 'card not valid!', 'error');
        this.spinner.hide();
      }
    }, (error) => this.spinner.hide());
  }

}
