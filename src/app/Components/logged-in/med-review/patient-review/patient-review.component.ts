import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';

import { SupplemetsComponent } from './supplemets/supplemets.component';
import { PatientService } from 'src/app/Services/patient.service';

@Component({
  selector: 'app-patient-review',
  templateUrl: './patient-review.component.html',
  styleUrls: ['./patient-review.component.css', '../../add-patient/add-patient.component.css']
})
export class PatientReviewComponent implements OnInit {

  ifEdit = false;
  patientId;
  patientInfo: any = [];
  patientForm: FormGroup;
  InitialForm: FormGroup; gender = [
    { value: 'Male' },
    { value: 'Female' }
  ];
  marital = [
    { value: 'Married' },
    { value: 'Single' }
  ];
  option = [
    { value: 'yes', name: 'Yes' },
    { value: 'no', name: 'No' }
  ];
  name: String;
  height: String;
  profileImg: File;
  imgURL;
  indicationList = [];
  indications = [];
  drugList = [];
  bloodTest = this.patientService.getBloodTest();
  bloodNum = 1;
  initiatReview = false;
  search_cond = '';
  search_med = '';
  supplement = [];

  constructor(private patientService: PatientService, private router: Router, private route: ActivatedRoute,
    private snackBar: MatSnackBar, private _fb: FormBuilder, public dialog: MatDialog) {

    // let getPatient = new Promise((resolve, rej) => {

    this.patientId = this.route.snapshot.paramMap.get('id');
    this.patientService.getPatient(this.patientId).subscribe(
      res => {
        this.patientInfo = res;
      }
    );

    // });

    // getPatient.then(res => {

    this.patientForm = this._fb.group({
      present: [],
      name: [],
      dob: [],
      // gender: [],
      weight: [],
      height: [],
      // marital_status: [],
      address: [],
      // mailing_address: [],
      // biling_address: [],
      profileImg: [],
      pre_existing_conditions: [],
      medication_history: [],
      allergies: ['no'],
      list_allergies: [],
      supplements: [],
      caffeine: ['no'],
      alcohol: ['no'],
      is_precription_taken_regularly: [],
      cyp_test: ['no'],
      insomnia: ['no'],
      weight_loss: ['no'],
      bladder: ['no'],
      mood_changes: ['no'],
      is_diabetic: ['no'],
      blood_test: this._fb.array([
        this._fb.group({
          key: [],
          range: [],
          value: []
        })
      ]),
      glucose_level: []
    });

    // });


    this.InitialForm = new FormGroup({
      review: new FormControl('no'),
      history: new FormControl('manual')
    });
  }

  ngOnInit() {

    this.patientService.getAllIndication().subscribe(
      res => {
        this.indicationList = res;
        this.indicationList.shift();
        // console.log(this.indicationList)
      }
    );
  };

  getReviewForm() {

    if (this.InitialForm.controls['review'].value == 'yes') {

      this.imgURL = this.patientInfo['profile_pic'].image;

      this.patientForm.patchValue({
        name: this.patientInfo['name'],
        dob: this.patientInfo['dob'],
        // gender: this.patientInfo['gender'],
        weight: this.patientInfo['weight'],
        height: this.patientInfo['height'],
        // marital_status: this.patientInfo['marital_status'],
        address: this.patientInfo['address'],
        // mailing_address: this.patientInfo['mailing_address'],
        // biling_address: this.patientInfo['biling_address'],
      });

      this.initiatReview = true;
      console.log(this.patientInfo)
    }
    else {
      this.initiatReview = false;
    }

  }

  get blood_test() {
    return this.patientForm.get('blood_test') as FormArray;
  };

  addAlias() {
    this.bloodNum++;
    this.blood_test.push(this._fb.group({
      key: [],
      range: [],
      value: []
    }));
  };

  onEdit() {
    this.ifEdit = true;
  }

  newProfile(event) {

    this.profileImg = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.profileImg);
    reader.onload = (e) => {
      this.imgURL = reader.result;
    }
  };

  onselectIndication() {

    let data = {
      indication_id: this.patientForm.controls['pre_existing_conditions'].value
    }

    this.patientService.getDrugForEachIndication(data).subscribe(
      res => {
        this.drugList = res;
      }
    )
  };

  onSelectDrug(event) {
    // console.log(this.patientForm);

    // if (event._selected) {

    //   if (event.value.food_interaction_questions) {

    //     const dialogRef = this.dialog.open(SupplemetsComponent, {
    //       width: '450px',
    //       data: event.value.food_interaction_questions
    //     });

    //     dialogRef.afterClosed().subscribe(result => {

    //       if (result == 'yes') {
    //         this.supplement.push(event.value.food_int_answer);
    //         // console.log(this.supplement)
    //         this.patientForm.controls['supliment_alcohol_caffiene_intake'].setValue(this.supplement);
    //         // console.log(this.patientForm['supliment_alcohol_caffiene_intake'])
    //       }
    //     });

    //   }
    // }

    // else if (!event._selected) {

    //   if (event.value.food_interaction_questions) {
    //     let index = this.supplement.indexOf(event.value.food_int_answer);
    //     if (index > -1) {
    //       this.supplement.splice(index, 1);
    //     }
    //     this.patientForm.controls['supliment_alcohol_caffiene_intake'].setValue(this.supplement);
    //     // console.log(this.patientForm['supliment_alcohol_caffiene_intake'])
    //   }
    // }

  };

  onUpdate(data) {

    if (this.profileImg != undefined) {
      let image = new FormData();
      image.append('profileImage', this.profileImg);
      this.patientService.updatePatient(this.patientId, image).subscribe(
        res => {
          console.log('image updated');
        }
      )
    }

    // console.log(data)

    let bloodT = data;
    bloodT.blood_test = bloodT.blood_test.map(res => {
      return {
        key: res.key['key'],
        range: res.key['range'],
        value: res.value
      }
    })

    // console.log(bloodT);
    // this.router.navigate([this.router.url + '/generate_report']);


    this.patientService.updatePatient(this.patientId, bloodT).subscribe(
      res => {
        this.snackBar.open(res, '', {
          duration: 2000
        })

        // this.ifEdit = false;
        this.router.navigate([this.router.url + '/generate_report']);

      }
    );
  };

}
