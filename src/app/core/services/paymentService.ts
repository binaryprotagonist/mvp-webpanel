import { Injectable } from '@angular/core';
var paymentData
export class PaymentService {

  paymentService(data) {
    paymentData = {
      planId: data.userId,
      userId: data.userId,
      planPrice: data.planPrice,
      subscriptionId: data.planId,
      planDuration: data.planDuration,
      stripePlanId: data.stripeId,
      planName: data.planName,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email
    }
    console.log("datdada in payemt service", paymentData)
  }
  getPaymentData() {
    return paymentData
  }
}
