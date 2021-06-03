import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../core/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  submitted: boolean = false;
  loginForm: FormGroup;
  passwordType: any = false;
  error: any;
  user: any;
  valueChanges: any;
  valueChanges1: any;
  constructor(private authService: SocialAuthService, private commonService: CommonService, private _router: Router, private formBuilder: FormBuilder, private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.onValidation()

  }
  onValidation() {
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")

      ]
      ],
      password: ['',
        [
          Validators.required,
          Validators.pattern(/^\S*$/)
        ]
      ],
    });
  }
  get formControls() {
    return this.loginForm.controls;
  }
  onShowPass() {
    this.passwordType = !this.passwordType
    if (this.passwordType == true) {

      document.getElementById("showpass").style.backgroundImage = "url('https://img.icons8.com/material-rounded/24/000000/hide.png')"
    }
    else {
      document.getElementById("showpass").style.backgroundImage = "url('https://img.icons8.com/material-rounded/24/000000/visible.png')"
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.spinner.show();

    let body = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    }
    this.commonService.post('login', body).subscribe((data: any) => {
      if (data.status == 200) {
        // this.toastr.success('Login Successfully', 'success');
        let token = data.token;
        localStorage.setItem('token', token);
        this.spinner.hide();
        this._router.navigate(["quickAccess"]);
      } else {
        this.spinner.hide();
        //this.error='Invalid email or password';
        this.toastr.warning('Invalid email or password', 'warning');
      }

    },
      (error) => {
        // this.error=error.error.error;
        // this.error='Invalid email or password';
        this.spinner.hide();
        this.toastr.warning('something went wrong', 'error');

      })

  }

  signInWithGoogle() {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.valueChanges = this.authService.authState.subscribe(async user => {
      this.user = user;
      await this.sigIn()
    });

  }
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.valueChanges = this.authService.authState.subscribe(async user => {
      this.user = user;
      await this.sigIn()

    });
  }

  sigIn(): void {
    console.log(this.user, 1)
    if (this.user) {
      let body = {
        email: this.user.email,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        authToken: this.user.authToken,
        provider: this.user.provider

      }
      this.commonService.post('socialLogin', body).subscribe((data: any) => {
        console.log(data)
        if (data.status == 200) {

          this.authService.signOut();
          this.user = "";

          let token = data.token;
          localStorage.setItem('token', token);
          this.toastr.success('Login Successfully', 'success');
          this.valueChanges.unsubscribe()

          this._router.navigate(["myAccount"]);

        } else {
          //this.error=data.message
          this.toastr.warning(data.message, 'Warning');



        }

      },
        (error) => {
          this.toastr.error('Something went wrong', 'Error');
        })
    }

    // console.log(JSON.stringify(resp))
  }


}
