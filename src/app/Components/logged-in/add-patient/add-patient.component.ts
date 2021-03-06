import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { PatientService } from 'src/app/Services/patient.service';
import { ErrorComponent } from '../../log-in/error/error.component';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent implements OnInit {

  profile_comp = 0;
  height = '';
  gender = [
    { value: 'Male (ذكر)' },
    { value: 'Female (نثى)' }
  ];
  marital = [
    { value: 'Married (متزوج)' },
    { value: 'Single (عزب)' }
  ];
  billingAdd = true;
  profileImg: File;
  imgURL: any = '';

  patientForm: FormGroup;

  constructor(private patientService: PatientService, private router: Router, private snackBar: MatSnackBar) {
    this.patientForm = new FormGroup({
      fname: new FormControl('', Validators.required),
      lname: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      weight: new FormControl('', Validators.required),
      height: new FormControl('', Validators.required),
      marital_status: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      mailing_address: new FormControl('', Validators.required),
      billAddChange: new FormControl('yes'),
      biling_address: new FormControl(''),
      profileImg: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {

    this.patientForm.valueChanges.subscribe(
      (res) => {
        var count = 0;

        if (res.fname != "" && res.lname != "") {
          count = count + 10;
        }
        if (res.address !== "") {
          count = count + 10;
        }
        if (res.gender != "") {
          count = count + 10;
        }
        if (res.weight != "") {
          count = count + 10;
        }
        if (res.height != "") {
          count = count + 10;
        }
        if (res.marital_status != "") {
          count = count + 10;
        }
        if (res.dob != "") {
          count = count + 10;
        }
        if (res.mailing_address != "") {
          count = count + 10;
        }
        if (res.billAddChange == "no") {
          count = count + 10;
        }
        if (res.biling_address != "") {
          count = count + 10;
        }
        if (res.profileImg != "") {
          count = count + 10;
        }

        this.profile_comp = count;
      }
    );
  }

  ChangBillingAddress() {
    if (this.patientForm.controls['billAddChange'].value == 'no') {
      this.billingAdd = false;
    }
    else {
      this.billingAdd = true;
    }
  };

  newProfile(event) {

    this.profileImg = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.profileImg);
    reader.onload = (e) => {
      this.imgURL = reader.result;
    }
  };


  onSubmit() {

    // if (this.billingAdd = false) {
    //   this.patientForm.controls['biling_address'].setValue(this.patientForm.controls['mailing_address'].value);
    // }

    // console.log(this.patientForm)

    let data = new FormData();
    data.append('name', this.patientForm.controls['fname'].value + ' ' + this.patientForm.controls['lname'].value);
    data.append('dob', this.patientForm.controls['dob'].value);
    data.append('gender', this.patientForm.controls['gender'].value);
    data.append('weight', this.patientForm.controls['weight'].value);
    data.append('height', this.patientForm.controls['height'].value);
    data.append('marital_status', this.patientForm.controls['marital_status'].value);
    data.append('address', this.patientForm.controls['address'].value);
    data.append('mailing_address', this.patientForm.controls['mailing_address'].value);
    data.append('billing_address', this.patientForm.controls['biling_address'].value);
    data.append('profileImage', this.profileImg);

    this.patientService.addPatient(data).subscribe(
      res => {
        this.snackBar.openFromComponent(ErrorComponent, {
          duration: 3000,
          data: 'Patient Added!'
        });

        this.router.navigate(['/review_list']);
      },
      err => { }
    )

  };

}
