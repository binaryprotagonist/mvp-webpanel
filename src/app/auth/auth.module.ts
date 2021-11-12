import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent, ResetPasswordComponent, ForgetPasswordComponent, RegisterComponent,NotesShareComponent } from './';
import { NgxSpinnerModule } from "ngx-spinner";
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { StripeCallbackComponent } from './stripe-callback/stripe-callback.component';


@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    NotesShareComponent,
    VerifyEmailComponent,
    StripeCallbackComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    NgxSpinnerModule
  ]
})
export class AuthModule { }
