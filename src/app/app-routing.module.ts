import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './Authentication/auth.guard';
import { LogInComponent } from './Components/log-in/log-in.component';
import { RegisterComponent } from './Components/register/register.component';
import { LoggedInComponent } from './Components/logged-in/logged-in.component';
import { CommunityComponent } from './Components/logged-in/community/community.component';
import { AddPatientComponent } from './Components/logged-in/add-patient/add-patient.component';
import { MedReviewComponent } from './Components/logged-in/med-review/med-review.component';
import { ResourcesComponent } from './Components/logged-in/resources/resources.component';
import { GenerateReportComponent } from './Components/logged-in/med-review/generate-report/generate-report.component';
import { AccountComponent } from './Components/logged-in/account/account.component';
import { PatientReviewComponent } from './Components/logged-in/med-review/patient-review/patient-review.component';
import { AdminComponent } from './Components/logged-in/admin/admin.component';
import { AdminGuard } from './Authentication/admin.guard';
import { PatientReportsComponent } from './Components/logged-in/med-review/patient-reports/patient-reports.component';
import { ReviewReportsComponent } from './Components/logged-in/med-review/patient-reports/review-reports/review-reports.component';

const routes: Routes = [
  { path: '', redirectTo: 'logIn', pathMatch: 'full' },
  { path: 'logIn', component: LogInComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '', component: LoggedInComponent, children: [
      { path: 'community', component: CommunityComponent },
      { path: 'add_patient', component: AddPatientComponent },
      { path: 'review_list', component: MedReviewComponent },
      { path: 'reports/:id', component: PatientReportsComponent },
      { path: 'reports/:id/:report_id', component: ReviewReportsComponent },
      { path: 'reports/:id/:report_id/generate_report', component: GenerateReportComponent },
      { path: 'resources', component: ResourcesComponent },
      { path: 'account', component: AccountComponent },
    ], canActivateChild: [AuthGuard]
  },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
