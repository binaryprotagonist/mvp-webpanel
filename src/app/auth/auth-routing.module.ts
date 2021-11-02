import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent, ResetPasswordComponent, ForgetPasswordComponent, RegisterComponent, NotesShareComponent } from './';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'reset-password/:userId',
        component: ResetPasswordComponent,
      },
      {
        path: 'forget-password',
        component: ForgetPasswordComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'verify-email/:id',
        component: VerifyEmailComponent
      },
      {
        path: 'note-share/:id',
        component: NotesShareComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
