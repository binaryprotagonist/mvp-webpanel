import { Component, OnInit, ViewChild,TemplateRef } from '@angular/core';
import { CommonService } from '../../core/services/common.service';
import { FormGroup, FormControl, FormBuilder,FormGroupDirective,  Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";

import { ImageCroppedEvent } from 'ngx-image-cropper';


@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  socialLogin: any;
  modalRef: BsModalRef;
  updateForm: FormGroup;
  emailUpdateForm: FormGroup;
  passwordForm: FormGroup;
  submitted = false;
  submitted1 = false;
  submitted2 = false;

  firstName: any;
  lastName: any;
  email: any;
  gender: any;
  edit = false;
  editEmail = false;
  error: any;
  profile: any;
  profileImage: any;
  PlanName: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  oldEmail: any;
  userData;
  @ViewChild('documentEditForm') documentEditForm: FormGroupDirective;

  constructor (private _router: Router,private commonService: CommonService,private formBuilder:FormBuilder,private modalService: BsModalService,private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getUser();

    this.updateForm = this.formBuilder.group({
      firstName: [{value: '', disabled: true}, [Validators.required, ]],
      lastName: [{value: '', disabled: true}, [Validators.required, ]],
    });
    this.emailUpdateForm = this.formBuilder.group({
      email: [{value: '', disabled: true}, [Validators.required, Validators.email, ]]
    });
    this.passwordForm = this.formBuilder.group({
     password: ['', [ Validators.required, Validators.pattern(/^\S*$/), Validators.minLength(6), Validators.maxLength(12), ]],
     newPassword: ['', [ Validators.required, Validators.pattern(/^\S*$/), Validators.minLength(6), Validators.maxLength(12), ]],
     confirmPassword: ['', [ Validators.required, Validators.pattern(/^\S*$/), Validators.minLength(6), Validators.maxLength(12), ]],
   }, { validator: this.ConfirmedValidator('newPassword', 'confirmPassword') });
  }

  ngAfterViewInit() {
    $('#OpenImgUpload').click(function(){ $('#imgupload').trigger('click'); });
  }
  get formControls() { return this.updateForm.controls; }
  get passwordControls() { return this.passwordForm.controls; }
  get emailControls() { return this.emailUpdateForm.controls; }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  getUser(){
    this.spinner.show();
    this.commonService.get(`getUser`).subscribe((data: any) => {
      if (data.status == 200){
        this.userData = data.result;
        this.firstName = data.result.firstName;
        this.lastName = data.result.lastName;
        this.email = data.result.email;
        this.oldEmail = data.result.email;
        this.profileImage = data.result.profileImage;
        this.gender = data.result.gender ? data.result.gender : '';
        this.socialLogin = data.result.socialLogin;
        this.PlanName = data.result.PlanName;
        this.spinner.hide();
        console.log(this.profileImage);
      }
  });
}
  editProfile(value) {
    this.edit = value;
    this.updateForm.enable();
    if (value) { this.updateForm.enable(); }
    else {
      this.firstName = this.userData.firstName;
      this.lastName = this.userData.lastName;
      this.gender = this.userData.gender;
      this.updateForm.disable();
    }
  }

  updateProfile(){
    this.submitted = true;
    if (this.updateForm.invalid){
      return;
    }
    if (this.gender === '' || this.gender === undefined ){
      this.error = 'Gender selection is required';
      return;
    }
    this.spinner.show();
    const body = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      gender: this.gender
    };
    this.commonService.post('editProfile', body).subscribe((data: any) => {
      console.log(data)
      if (data.status === 200){
        this.toastr.success('Details Updated Successfully', 'success');
        this.updateForm.disable();
        this.edit = false;
        this.getUser();
        this.spinner.hide();
      }
      if (data.status == 204){
          this.toastr.error('Email already exist', 'error');
          this.updateForm.disable();
          this.edit = false;
          this.getUser();
          this.spinner.hide();
      }
      else{
        this.spinner.hide();
      }
    });
  }

  editMail(value){
    this.editEmail = value;
    console.log('value', value);
    if (value) { this.emailUpdateForm.enable(); }
    else {
      this.email = this.userData.email;
      this.emailUpdateForm.disable();
     }
  }
  updateEmail(){
    this.submitted2 = true;
    if (this.emailUpdateForm.invalid){
      return ;
    }
    this.spinner.show();
    const body = {
      email: this.email,
      emailOld: this.oldEmail
    };
    this.commonService.post('emailUpdate', body).subscribe((data: any) => {
      console.log(data);
      if (data.status == 200){
        // this.toastr.success('update Successfully', 'success');
        Swal.fire('Please check your mail!', '', 'success');
        this.emailUpdateForm.disable();
        this.editEmail = false;
        this.getUser();
        this.spinner.hide();
      }
      if (data.status == 204){
          this.toastr.error('Email already exist', 'error');
          this.emailUpdateForm.disable();
          this.editEmail = false;
          this.getUser();
          this.spinner.hide();
      } else {
        this.spinner.hide();
      }
    });
  }


  fileChangeEvent(event: any, template): void {
    this.imageChangedEvent = event;
    this.openModal(template);
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
  }

  cropperReady() {
  }

  loadImageFailed() {
  }

  onProfileChange(event){
    const file = event.target.files[0];
    this.spinner.show();
    const formData = new FormData();
    formData.append('file', file);
    this.commonService.post('uploadImage', formData).subscribe((data: any) => {
      this.spinner.hide();
      if (data.status == 200){
        this.getUser();
      }
    }, (error) => { this.spinner.hide(); });
  }

  uploadProfile() {
    const body = {
      data: this.croppedImage
    };
    this.commonService.post('base64img', body).subscribe((data: any) => {
      console.log(data);
      this.getUser();
      this.modalRef.hide();
    }, (error) => {
      console.log('this.profile error', error);
      this.modalRef.hide();
      this.spinner.hide();
    });
  }
  onProfileRemove(){
  Swal.fire({
    title: 'Are you sure?',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: 'Yes,Remove it!'
  }).then((willDelete) => {
      if (willDelete.value) { this.ProfileRemove(); }
    });
  }

  ProfileRemove(){
    const body = {
      profileImage: null
     };
    this.commonService.post('removeProfileImage', body).subscribe((data: any) => {
    if (data.status == 200) {
      this.toastr.success('remove Successfully', 'success');
      this.getUser();
    }
   });
  }

  onSubmit(){
    this.submitted1=true
    if(this.passwordForm.invalid){
      return ;
    }
    this.spinner.show();
    let body={
      password:this.passwordForm.value.newPassword,
      oldPassword:this.passwordForm.value.password
     }
     this.commonService.post('updatePassword',body).subscribe((data: any)=>{
      this.modalRef.hide()
      this.spinner.hide();
      this.toastr.success('Password Successfully Update !!', 'success');
     },
      (error)  =>{
        this.spinner.hide();
      }
     )


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
  signOut(){
    localStorage.clear()
    this._router.navigate(["login"]);

  }
  onDelete(){
  Swal.fire({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this imaginary file!",
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!'
  })
    .then((willDelete) => {
      if (willDelete.value) {
        this.deleteUsers()
      } else {
      }
      console.log(willDelete)
    })
  }
  deleteUsers(){
    let body={
      isStatus:2,
     }
     this.commonService.delete('deleteUser','').subscribe((data: any)=>{
      console.log(data)
      if(data.status==200){
        this.toastr.success('deleted', 'success');
        localStorage.clear()
        this._router.navigate(["login"]);
      }else{
      }
  })
  }
}
