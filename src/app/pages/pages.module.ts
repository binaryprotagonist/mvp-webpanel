import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages.routing.module';
import { PagesComponent } from './pages.component';
import { NotesComponent, MyAccountComponent, DashboardComponent, QuickAcessComponent, NotesWritingComponent, TrashComponent, Subscription,HelpComponent,PaymentComponent } from './';
import { FooterComponent, HeaderComponent } from '../shared';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

// import { AngularEditorModule } from '@kolkov/angular-editor';
import { SearchPipe } from './search.pipe';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { NgxStripeModule } from 'ngx-stripe';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxSpinnerModule } from "ngx-spinner";
import { AngularResizeElementModule } from 'angular-resize-element';
import { ImageCropperModule } from 'ngx-image-cropper';

import {NgxMarkjsModule} from 'ngx-markjs';
import {NgxPrintModule} from 'ngx-print';
import {AutoSizeInputModule} from 'ngx-autosize-input';
// import { TrashComponent } from './trash/trash.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxCleaveDirectiveModule } from "ngx-cleave-directive";

// import { MatMomentDateModule } from "@angular/material-moment-adapter";
@NgModule({
  declarations: [
    PagesComponent,
    NotesComponent,
    MyAccountComponent,
    FooterComponent,
    HeaderComponent,
    DashboardComponent,
    QuickAcessComponent,
    NotesWritingComponent,
    TrashComponent,
    PaymentComponent,
    Subscription,
    SearchPipe,
    HelpComponent,

  ],

  imports: [
    PagesRoutingModule,
    FormsModule,
    CommonModule,
    BsDatepickerModule,
    AngularEditorModule,
    ReactiveFormsModule,
    SweetAlert2Module,
    NgxSpinnerModule,
    MatProgressBarModule,
    AngularResizeElementModule,ImageCropperModule,
    AngularResizeElementModule,
    NgxMarkjsModule,
    NgSelectModule,
    NgxPrintModule,
    AutoSizeInputModule,
    NgxStripeModule.forRoot('pk_test_51IAVLlKtscOzAwJa1mSaNstU1Ph87JWilKiDr5N9f5jkXztA8Dc2ShN4htT47f6Ltd5OS5IPnx3rfzZhRm6emduv00OfSN7db5'),
    NgxCleaveDirectiveModule
  ],
  providers: [],
})
export class PagesModule { }
