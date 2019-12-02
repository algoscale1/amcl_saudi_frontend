import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { PatientService } from 'src/app/Services/patient.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {

  starsCount1 = 0;
  patientList: MatTableDataSource<any>
  displayedColumns: string[] = ['name', 'dob', 'interaction'];
  dataSource: MatTableDataSource<any>;
  filterForm: FormGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private patientService: PatientService, private ngxLoader: NgxUiLoaderService) {
    this.filterForm = new FormGroup({
      dob: new FormControl(''),
      search: new FormControl(''),
    });
  }

  ngOnInit() {

    this.ngxLoader.stop();

    this.ngxLoader.startBackground();

    this.patientService.getPatientList(this.filterForm.value).subscribe(
      res => {
        this.patientList = new MatTableDataSource(res);
        this.patientList.paginator = this.paginator;
        this.patientList.sort = this.sort;
        this.ngxLoader.stopBackground();
      }
    );
    //this.ngxLoader.stop();
    // this.filters()
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
  getDateOfBirth() {

    this.patientService.getDob(this.filterForm.value).subscribe(
      res => {

        this.patientList = new MatTableDataSource(res);
        this.patientList.paginator = this.paginator;
        this.patientList.sort = this.sort;

      }
    );
  }
  searchFilters() {
    this.patientService.getPatientSearch(this.filterForm.value).subscribe(
      res => {
        this.patientList = new MatTableDataSource(res);
        this.patientList.paginator = this.paginator;
        this.patientList.sort = this.sort;
      }
    );
  }

  clearAll() {
    this.filterForm.setValue({
      search: '',
      dob: ''
    });
    this.filters()
  }

}
