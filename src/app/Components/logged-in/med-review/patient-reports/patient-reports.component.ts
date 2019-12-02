import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { PatientService } from 'src/app/Services/patient.service';
import { ReportsService } from 'src/app/Services/reports.service';
import { DeleteReportComponent } from './delete-report/delete-report.component';

@Component({
  selector: 'app-patient-reports',
  templateUrl: './patient-reports.component.html',
  styleUrls: ['./patient-reports.component.css']
})
export class PatientReportsComponent implements OnInit {

  displayedColumns: string[] = ['#', 'created_on', 'last_reviewed', 'edit', 'delete'];
  basicInfo: FormGroup;
  reports;
  patientInfo: any;
  patient_id: any;
  ft = ['2', '3', '4', '5', '6', '7', '8', '9'];
  inch = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  gender = ['Male', 'Female'];
  marital = ['Married', 'Single'];
  patientList: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private patientService: PatientService, private reportService: ReportsService, private router: Router,
    private ngxLoader: NgxUiLoaderService, private route: ActivatedRoute, private _fb: FormBuilder, public dialog: MatDialog, ) {

    this.basicInfo = new FormGroup({
      fname: new FormControl(''),
      lname: new FormControl(''),
      dob: new FormControl(''),
      gender: new FormControl(''),
      weight: new FormControl(''),
      heightFt: new FormControl(''),
      heightIn: new FormControl(''),
      marital_status: new FormControl(''),
      mailing_address: new FormControl(''),
      biling_address: new FormControl(''),
      profileImg: new FormControl('')
    });
  }

  ngOnInit() {
    //     this.reportService.getCommonInfo().subscribe(res=>{
    // console.log('CI..',res)
    //     });
    this.patient_id = this.route.snapshot.paramMap.get('id');
    this.ngxLoader.start();
    this.patientService.getPatientData(this.patient_id).subscribe(res => {
      this.ngxLoader.stop();
      console.log('shgdhsafhnbn', res);
      this.patientInfo = res;
      this.reports = res['reports'];

      let firstName: string = this.patientInfo['name'];
      let height: string = this.patientInfo['height'];
      this.basicInfo.patchValue({
        fname: firstName.split(' ', 1)[0],
        lname: firstName.split(' ', 2)[1],
        dob: this.patientInfo['dob'],
        gender: this.patientInfo['gender'],
        weight: this.patientInfo['weight'],
        heightFt: height.split('.', 1)[0],
        heightIn: height.split('.', 2)[1],
        marital_status: this.patientInfo['marital_status'],
        mailing_address: this.patientInfo['mailing_address'],
        biling_address: this.patientInfo['billing_address'],
      });
    });
  }

  onDelete(report_id) {
    const dialogRef = this.dialog.open(DeleteReportComponent, {
      width: '450px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reportService.deleteReport(this.patient_id, report_id).subscribe(
          res => {
            console.log(res);
            this.ngOnInit();
          }
        );

      }
    });
  }

  onEdit(report_id) {
    this.router.navigate([`/reports/${this.patient_id}/${report_id}`]);
  }

  generateReport(report_id) {
    this.router.navigate([`/reports/${this.patient_id}/${report_id}/generate_report`]);
  }

  addReport() {
    // this.router.navigate([`/new_review/${this.patient_id}`]);

    this.ngxLoader.start();

    let data = {
      patient_id: this.patient_id
    }

    this.reportService.createReport(data).subscribe(
      res => {
        this.ngxLoader.stop();
        this.router.navigate([`/reports/${this.patient_id}/${res.report_id}`]);
      }
    )
  }

}
