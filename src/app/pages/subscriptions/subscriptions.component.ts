import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {

  constructor(private commonService: CommonService,
    private spinner: NgxSpinnerService) { }

  plans = [];
  currentPlan = '';
  userId;
  plandata: any;
  userData: any;

  ngOnInit(): void {
    this.getData();
  }
  getData() {
    const apiList = [
      this.getPlans(),
      this.getTransparentPricing()
    ];
    this.spinner.show();
    forkJoin(apiList).subscribe((finalData) => {
      this.spinner.hide();
      if (finalData[0]) {
        this.plans = finalData[0].plans;
        this.currentPlan = finalData[0].currentPlan;
        this.userId = finalData[0].userId;
        this.userData = finalData[0].userData;
        setTimeout(() => {
          document.getElementById(this.currentPlan).classList.add('PayButton')
        }, 100);
      }
      if (finalData[1]) {
        this.plandata = finalData[1];
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }
  getUser(plans?): Observable<any> {
    return this.commonService.get(`getUser`)
    .pipe(
      map((userResponse: any) => {
      if (userResponse.status == 200) {
        return {
          plans,
          currentPlan: userResponse.result.currentPlan,
          userId: userResponse.result.id,
          userData: userResponse.result
        }
      }
      return null;
      }),
      catchError(error => of(null))
    )
  }
  getTransparentPricing(): Observable<any> {
    return this.commonService.get(`getTransparentPricing`)
    .pipe(map((data: any) => {
      if (data.status == 200) {
        return data.result
      }
      return null;
    }));
  }
  getPlans(): Observable<any> {
    return this.commonService.get(`getSubscriptionPlan`)
    .pipe(mergeMap((plansResponse: any) => {
      if (plansResponse.result.length > 0) {
        return this.getUser(plansResponse.result)
      }
      return null;
    }))
  }
  onChoosePlan(plan) { 
    const body = {
      planName: plan.planName,
      planPrice: plan.planPrice,
      planDuration: plan.planDuration,
      subscriptionId: plan._id,
      stripePlanId: plan.stripeData.planId,
      stripePriceId: plan.stripeData.priceId
    }
    this.spinner.show();
    this.commonService.post('checkoutApi', body).subscribe((data: any) => {
      this.spinner.hide();
      open(data.data, '_self');
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
    this.spinner.show();
    this.commonService.post(`planCancel`, body).subscribe((data: any) => {
      if (data.status == 200) {
        this.getUser().subscribe((user) => {
          this.spinner.hide();
          if (user) {
            this.userId = user.userId,
            this.userData = user.userData
            Swal.fire('Subscription cancelled', 'success');
            document.getElementById(this.currentPlan).classList.remove('PayButton');
          }
        })
      }
      if (data.status == 400) {
        this.spinner.hide();
        Swal.fire('Error', `Something went Wrong!`, 'error');
      }
    }, (error) => {
      this.spinner.hide();
      Swal.fire('Error', `Something went Wrong!`, 'error');
    });
  }

}
