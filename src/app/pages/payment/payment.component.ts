import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../core/services/common.service';
import { NgxSpinnerService } from "ngx-spinner";
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
  planData
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
  constructor(private commonService: CommonService, private router: Router, private stripeService: StripeService, private fb: FormBuilder, private spinner: NgxSpinnerService, private PaymentService: PaymentService, private CountryList: CountryName) { }

  ngOnInit(): void {
    this.getPaymentData()

  }

  async getPaymentData() {

    const data = await this.PaymentService.getPaymentData()
    if (!data) {
      this.router.navigate(['/subscription'])
    }
    else {

      this.planData = data
      this.planPrice = data.planPrice
      this.countryList = this.CountryList.getCountry()
      this.paymentForm()
    }
  }
  applyCoupon() {
    // alert(this.stripeTest.value('coupon'))
    let data = {
      couponId: this.stripeTest.value.coupon
    }
    console.log("data ", this.stripeTest.value.coupon)
    this.commonService.post(`getCoupons`, data).subscribe((data: any) => {
      console.log("plandata.currentPlan.noteUsage", data)

      if (data.status == 200) {
        this.couponData = data.data
        this.discount = (this.couponData.percent_off / 100) * this.planPrice
        console.log("plandata.currentPlan", this.discount, this.couponData.percent_off)
        this.planPrice = this.planPrice - this.discount
        this.couponMessage = null
        this.couponId = this.stripeTest.value.coupon
        document.getElementById("coupon").setAttribute("readonly", 'true');
      }
      if (data.status == 404) {
        this.discount = null
        this.couponId = ''
        this.couponMessage = 'Invalid Coupon code'
      }
    })
  }
  cancleCoupon() {
    this.discount = null
    this.stripeTest.value.coupon = null
    $('input[name=coupon]').val("")
    this.planPrice = this.mainPrice
    document.getElementById("coupon").removeAttribute("readonly");
    this.couponId = ''
    // document.getElementById("coupon").reset();
  }

  paymentForm() {
    this.stripeTest = this.fb.group({
      firstName: [this.planData ? this.planData.firstName : '', [Validators.required, Validators.minLength(3)]],
      lastName: [this.planData ? this.planData.lastName : '', [Validators.required, Validators.minLength(3)]],
      email: [this.planData ? this.planData.email : '', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      // card: ['', [ Validators.minLength(19), Validators.maxLength(19)]],
      // expMonth: ['', [Validators.required,]],
      // expYear: ['', [Validators.required,]],
      // cvc: ['', [Validators.required]],
      streetAddress: ['', [Validators.required]],
      postal: ['', [Validators.required]],
      city: ['', [Validators.required]],
      apartment: ['', [Validators.required]],
      country: ['', [Validators.required]],
      coupon: ['']

    })
    this.stripeTest.valueChanges.subscribe(data => this.onValueChanges(data))

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
    'city': {
      'required': 'City is required',
    },

    'streetAddress': {
      'required': 'Street Address is required',
    },
    'apartment': {
      'required': 'Apartment is required',
    },
    'postal': {
      'required': 'Postal is required',
    },
    'card': {
      'required': 'card number is required',
      'minlength': 'minimum 16 digit required',
      'maxlength': 'minimum 16 digit required'
    },
    'expMonth': {
      'required': 'Expairy month is required',
    },
    'expYear': {
      'required': 'Expairy Year is required',
    },
    'cvc': {
      'required': 'cvc is required',
    },
    'country': {
      'required': 'country is required',
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
      country: this.stripeTest.value.country,
      apartment: this.stripeTest.value.apartment,
      city: this.stripeTest.value.city,
      postal: this.stripeTest.value.postal,
      streetAddress: this.stripeTest.value.streetAddress,
      token:token
      // number: this.stripeTest.value.card,
      // exp_month: this.stripeTest.value.expMonth,
      // exp_year: this.stripeTest.value.expYear,
      // cvc: this.stripeTest.value.cvc,
    }
    if(this.stripeTest.value.card==''){
        this.stripeTestError.card = 'card number is required'
    }
    if (this.stripeTest.valid) {

      this.spinner.show();

      console.log("payment data", this.stripeTest.value)
      this.commonService.post(`create-payment`, body).subscribe((data: any) => {
        this.spinner.hide();
        if (data.status == 200) {
          console.log("paymen responce", data)
          Swal.fire('Hurray!!',
            'Your subscription begins now!!',
            'success');
          this.router.navigate(["subscription"]);

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
      })
    }
  }

  createToken(){
    this.stripeTest.markAllAsTouched()
    this.onValueChanges()
  
    console.log(this.stripeTest.value.firstName)
    const name = this.stripeTest.value.firstName + this.stripeTest.value.lastName;
    if(this.stripeTest.valid){
      this.stripeService
      .createToken(this.card.element, { name})
      .subscribe((result) => {
        console.log(result.token)
        if (result.token) {
          this.onpaymentDone(result.token)
        } else if (result.error) {
          console.log("error", result.error.message);
          Swal.fire('ohh snap!',
            'card not valid!',
            'error');
          this.spinner.hide();

        }
      });
    }else{
      return
    }
    
  }

}
