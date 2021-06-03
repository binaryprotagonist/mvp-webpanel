import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder,  Validators } from '@angular/forms';
import { CommonService } from '../../core/services/common.service';
import { Router ,ActivatedRoute } from '@angular/router';
// import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  userId:any;
  submitted = false;
  changePasswordForm: FormGroup;

  constructor(private commonService: CommonService,private _router: Router,private formBuilder: FormBuilder,
    private route: ActivatedRoute) { 

    }
  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      password:['',
       [
        Validators.required,
        Validators.pattern(/^\S*$/),
        Validators.minLength(6),
        Validators.maxLength(12),

      ]
    ],
    confirmPassword:['',
       [
        Validators.required,
        Validators.pattern(/^\S*$/),
      ]
    ],
   },{
    validator: this.ConfirmedValidator('password', 'confirmPassword')
   })
    this.route.params.subscribe(params => {
      this.userId=params.userId
      // In a real app: dispatch action to load the details here.
   }
   );
  }
  get formControls() { return this.changePasswordForm.controls; }


  onSubmit(){
    this.submitted = true;
    if(this.changePasswordForm.invalid){
    return ;
    }
    let body={
      password:this.changePasswordForm.value.password,
      confirmPassword:this.changePasswordForm.value.confirmPassword,
      _id:this.userId
    }
    console.log(body)
    this.commonService.post('resetPassword',body).subscribe((data: any)=>{
      console.log("enter",data)
     // this.spinner.hide();
      //this.openModal(template);
      //this.send=true;
      setTimeout(()=>{
              this._router.navigate(["login"]);
         }, 5000);
      })

  }
  ConfirmedValidator(controlName: string, matchingControlName: string){
   

    return (formGroup: FormGroup) => {

        const control = formGroup.controls[controlName];

        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {

            return;

        }

        if (control.value !== matchingControl.value) {

            matchingControl.setErrors({ confirmedValidator: true });

        } else {

            matchingControl.setErrors(null);

        }

    }
  }


}
