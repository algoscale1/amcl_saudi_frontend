import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { DoctorAccountService } from 'src/app/Services/doctor-account.service';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EditAccountComponent } from './edit-account/edit-account.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  doctorDetails = [];
  fname = '';
  lname = '';

  constructor(private doctorService: DoctorAccountService, public dialog: MatDialog) { }

  ngOnInit() {

    this.doctorService.getAccountDetails().subscribe(
      res => {
        this.doctorDetails = res;
        let name: string = this.doctorDetails['name'];
        this.fname = name.split(' ', 2)[0];
        this.lname = name.split(' ', 2)[1];
        // console.log(this.doctorDetails);
      }
    );
  }

  changePassword() {

    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '450px',
      data: this.doctorDetails
    });

  };

  editAccount() {

    const dialogRef = this.dialog.open(EditAccountComponent, {
      width: '450px',
      data: this.doctorDetails
    });
  };

}
