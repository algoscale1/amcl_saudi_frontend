import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { AdminService } from 'src/app/Services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  doctorList;

  constructor(private adminService: AdminService, private snackbar: MatSnackBar, private router: Router) { }

  ngOnInit() {

    this.adminService.getAllDoctor().subscribe(
      res => {
        console.log(res);
        this.doctorList = res;
      }
    );
  }

  onEdit(id, is_verified) {
    // console.log(id);
    let data = {
      'doctor_id': id,
      'isVerified': is_verified
    }

    this.adminService.onEditDoctor(data).subscribe(
      res => {
        console.log(res);
        this.ngOnInit();
      }
    );
  };

  onDelete(id) {

    this.adminService.onDeleteDoctor(id).subscribe(
      res => {
        console.log(res);
        this.snackbar.open('Doctor Deleted successfully', '', {
          duration: 2000,
        });
        this.ngOnInit();
      }
    )
  };

  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('group');
    this.router.navigate(['/logIn']);
  };

}
