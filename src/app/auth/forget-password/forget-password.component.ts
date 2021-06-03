import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../core/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";



@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  submitted:boolean= false;
  forgetForm: FormGroup;
  constructor(private commonService: CommonService,private _router: Router,private formBuilder: FormBuilder,private spinner: NgxSpinnerService,private toastr: ToastrService) { }

  ngOnInit(): void {
    
    this.forgetForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")

    ] 
  ]
   });
  }
  get formControls() { return this.forgetForm.controls; }

  onSubmit(){
    this.submitted = true;
    if(this.forgetForm.invalid){
    return ;
    }
    this.spinner.show();
    let body={
      email:this.forgetForm.value.email,
     }
     this.commonService.post('forgetPassword',body).subscribe((data: any)=>{
      this.spinner.hide();

       if(data && data.status==200){
        this.toastr.success('Email sent', 'success');
       }else{
        this.spinner.hide();
        this.toastr.warning(data.message, 'Warning');
 
       }

      
    },
    (error) => { 
      // this.error=error.error.error;
      // this.error='Invalid email or password';
      this.toastr.error("something went wrong", 'Error');

      console.log('error',error);
  })

  }

}
