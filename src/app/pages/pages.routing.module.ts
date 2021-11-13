import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { NotesComponent, MyAccountComponent, DashboardComponent, QuickAcessComponent, NotesWritingComponent, TrashComponent, Subscription, HelpComponent, PaymentComponent } from './';
import { TrainingComponent } from './training/training.component';
import { UpdatesComponent } from './updates/updates.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';

const routes: Routes = [
  {
    path: '', component: PagesComponent,
    children: [
      { path: 'notes/:subjectId', component: NotesComponent },
      { path: 'myAccount', component: MyAccountComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'quickAccess', component: QuickAcessComponent },
      { path: 'notesWriting/:id', component: NotesWritingComponent },
      { path: 'trash', component: TrashComponent },
      // { path: 'subscription', component: Subscription },
      { path: 'subscription', component: SubscriptionsComponent },
      { path: 'helpSuport', component: HelpComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'training', component: TrainingComponent },
      { path: 'updates', component: UpdatesComponent }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
