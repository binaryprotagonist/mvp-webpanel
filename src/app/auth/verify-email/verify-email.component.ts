import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/core/services';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private spinner: NgxSpinnerService,
              private router: Router,
              private commonService: CommonService) { }

  verificationSuccess = false;
  verificationFailed = false;
  response = false;
  errorMessage = 'Internal Server Error';
  ngOnInit(): void {
    this.loadParams();
  }

  loadParams(): void {
    this.route.params.subscribe(({id}) => {
      this.verifyUser(id);
    });
  }

  verifyUser(id): void {
    this.spinner.show();
    this.commonService.post('verifyUser', {userId: id}).subscribe((resp: any) => {
      this.spinner.hide();
      this.response = true;
      console.log(resp);
      if (resp.success) {
        this.verificationSuccessHandler();
      } else {
        this.verificationFailureHandler(resp.message);
      }
    }, (error) => {
      this.spinner.hide();
      this.response = true;
      const errorMessage = error?.error?.message || 'Internal server error';
      this.verificationFailureHandler(errorMessage);
    });
  }

  verificationSuccessHandler(): void {
    this.verificationSuccess = true;
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000);
  }

  verificationFailureHandler(message?): void {
    this.verificationFailed = true;
    this.errorMessage = message || 'Internal server error';
  }

}
