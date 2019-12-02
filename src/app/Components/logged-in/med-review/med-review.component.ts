import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

import { PatientService } from 'src/app/Services/patient.service';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-med-review',
  templateUrl: './med-review.component.html',
  styleUrls: ['./med-review.component.css']
})
export class MedReviewComponent implements OnInit {
  filterForm: FormGroup;
  patientList: MatTableDataSource<any>;
  displayedColumns: string[] = ['name'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private patientService: PatientService, private router: Router, public dialog: MatDialog, private ngxLoader: NgxUiLoaderService) {
    this.filterForm = new FormGroup({
      dobFrom: new FormControl(''),
      dobTo: new FormControl(''),
      search: new FormControl(''),
    });
  }

  ngOnInit() {

    this.ngxLoader.start();

    this.patientService.getPatientList(this.filterForm.value).subscribe(
      res => {
        this.patientList = new MatTableDataSource(res)
        this.patientList.paginator = this.paginator
        this.patientList.sort = this.sort
        this.ngxLoader.stop();

      }
    )
  }

  filters() {

    this.ngxLoader.startBackground();

    this.patientService.getPatientList(this.filterForm.value).subscribe(
      res => {
        this.patientList = new MatTableDataSource(res);
        this.patientList.paginator = this.paginator;
        this.patientList.sort = this.sort;
        this.ngxLoader.stopBackground();
      }
    );
  }

  patientDetail(id) {
    this.router.navigate([`/reports/${id}`]);
  };

  onDelete(id) {

    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.patientService.deletePatient(id).subscribe(
          res => {
            this.ngOnInit();
          }
        )

      }
    });

  };

}