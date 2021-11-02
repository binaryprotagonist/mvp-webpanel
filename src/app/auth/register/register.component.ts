import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../core/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { SocialAuthService } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  registerButton = true;
  checked = false;
  error: any;
  user: any;
  valueChanges: any;
  valueChanges1: any;
  passwordType: any = false;
  year = new Date().getFullYear();

  constructor(private authService: SocialAuthService,
              private commonService: CommonService,
              private _router: Router,
              private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^\S*$/),
        Validators.minLength(6),
        Validators.maxLength(12)]]
    });
  }

  get formControls() { return this.registerForm.controls; }

  checkCheckBoxvalue(e): void{
    if (!this.checked){
      this.checked = true;
      this.registerButton = false;
    }else{
      this.checked = false;
      this.registerButton = true;
    }
  }
  onShowPass(): void {
    this.passwordType  = !this.passwordType;
    if (this.passwordType === true){

    document.getElementById('showpass').style.backgroundImage = 'url(\'https://img.icons8.com/material-rounded/24/000000/hide.png\')';
    }
    else{
      document.getElementById('showpass').style.backgroundImage = 'url(\'https://img.icons8.com/material-rounded/24/000000/visible.png\')';
    }
  }
  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid){
      return ;
      }
    this.spinner.show();
    const body = {
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName
     };
    this.commonService.post('register', body).subscribe((data: any) => {
      if (data.status == 200) {
        this.spinner.hide();

        this.toastr.success('Login Successfully', 'success');
        const token = data.token;
        localStorage.setItem('token', token);
        this._router.navigate(['quickAccess']);
      }else{
        this.spinner.hide();
        this.toastr.warning(data.message, 'Warning');
      }
    }, (error) => {
      this.spinner.hide();
      this.toastr.error('Something went wrong', 'Error');
    });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.valueChanges = this.authService.authState.subscribe(async user => {
       this.user = user;
       await this.sigIn();

    });

  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.valueChanges = this.authService.authState.subscribe(async user => {
      this.user = user;
      await this.sigIn();

   });
  }

  signOut(): void {
    this.authService.signOut();
  }

  sigIn(): void {
    this.spinner.show();
    if (this.user) {
          const body = {
            email: this.user.email,
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            authToken: this.user.authToken,
            provider: this.user.provider

          };
          this.commonService.post('socialLogin', body).subscribe((data: any) => {
            console.log(data);
            if (data.status === 200){
            this.spinner.hide();
            this.authService.signOut();
            this.user = '';
            const token = data.token;
            localStorage.setItem('token', token);
            this.toastr.success('Login Successfully', 'success');
            this.valueChanges.unsubscribe();
            this._router.navigate(['myAccount']);
            } else {
              // this.error=data.message
              this.spinner.hide();
              this.toastr.warning(data.message, 'Warning');
            }
          }, (error) => {
            this.spinner.hide();
            this.toastr.error('Something went wrong', 'Error');
          });
        }
  }
}
