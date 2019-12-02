import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { PatientService } from 'src/app/Services/patient.service';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.css', '../review-reports.component.css']
})
export class GeneralInfoComponent implements OnInit {


  ft = ['2', '3', '4', '5', '6', '7', '8', '9'];
  inch = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  gender = ['Male', 'Female'];
  marital = ['Married', 'Single'];
  billingAdd = true;
  profileImg: File;
  imgURL;

  patientForm: FormGroup;
  @Input() patientData;
  @Input() id;

  constructor(private _fb: FormBuilder, private patientService: PatientService, private ngxLoader: NgxUiLoaderService, private snackBar: MatSnackBar) {

    this.patientForm = this._fb.group({
      fname: '',
      lname: '',
      dob: '',
      gender: '',
      weight: '',
      heightFt: '',
      heightIn: '',
      marital_status: '',
      mailing_address: '',
      billAddChange: 'yes',
      biling_address: '',
      profileImg: ''
    });
  }

  ngOnInit() {
    this.imgURL = this.patientData['profile_pic'].image
    let firstName: string = this.patientData['name'];
    let height: string = this.patientData['height'];
    this.patientForm.patchValue({
      fname: firstName.split(' ', 1)[0],
      lname: firstName.split(' ', 2)[1],
      dob: this.patientData['dob'],
      gender: this.patientData['gender'],
      weight: this.patientData['weight'],
      heightFt: height.split('.', 1)[0],
      heightIn: height.split('.', 2)[1],
      marital_status: this.patientData['marital_status'],
      mailing_address: this.patientData['mailing_address'],
      biling_address: this.patientData['billing_address'],
    });
  }

  ChangBillingAddress() {
    if (this.patientForm.controls['billAddChange'].value == 'no') {
      this.billingAdd = false;
    }
    else {
      this.billingAdd = true;
    }
  }

  newProfile(event) {

    this.profileImg = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.profileImg);
    reader.onload = (e) => {
      this.imgURL = reader.result;
    }
  }

  onUpdate() {

    if (this.profileImg != undefined) {
      let image = new FormData();
      image.append('profileImage', this.profileImg);
      this.patientService.updatePatient(this.id, image).subscribe(
        res => {
          this.ngxLoader.stopBackground();
          console.log('image updated');
        }
      );
    }

    let formdata = this.patientForm.value;
    formdata['name'] = formdata.fname + " " + formdata.lname;
    formdata['height'] = formdata.heightFt + "." + formdata.heightIn;

    this.ngxLoader.startBackground();

    this.patientService.updatePatient(this.id, formdata).subscribe(
      res => {
        this.ngxLoader.stopBackground();
        this.snackBar.open('Patient Data updated', '', {
          duration: 2000
        });
      }
    );
  }
  public hasError = (controlName: string, errorName: string) =>{
    return this.patientForm.controls[controlName].hasError(errorName);
  }

}



