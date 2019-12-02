import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { PatientService } from 'src/app/Services/patient.service';

@Component({
  selector: 'app-diet-lifestyle',
  templateUrl: './diet-lifestyle.component.html',
  styleUrls: ['./diet-lifestyle.component.css', '../review-reports.component.css']
})
export class DietLifestyleComponent implements OnInit {

  patientForm: FormGroup;
  bloodTest;
  bloodNum = 1;
  metabolicTest;
  metabolicNum = 1;

  @Input() patientData;

  constructor(private patientService: PatientService, private _fb: FormBuilder) {

    this.patientForm = this._fb.group({
      blood_test: this._fb.array([]),
      metabolic_test: this._fb.array([]),
      glucose_level: '',
      additional_comment: '',
      is_diabetic: 'no',
      is_smoke: false,
      frequency_of_alchol: ''
    });
  }



  // for blood test preseleceted
  compareObjects(o1: any, o2: any): boolean {
    return o1.key === o2.key
      && o1.range === o2.range
      && o1.highDesc === o2.highDesc
      && o1.lowDesc === o2.lowDesc
      && o1.value === o2.value;
  }

  ngOnInit() {

    this.patientService.getBloodTest().subscribe(
      res => {
        this.bloodTest = res;
      }
    );

    this.patientService.getMetabolicTest().subscribe(
      res => {
        this.metabolicTest = res;
      }
    );

    if (this.patientData['blood_test'].length != 0) {
      this.patientForm.setControl('blood_test', this.set_bloodTest(this.patientData['blood_test']));
    }

    if (this.patientData['metabolic_test'].length != 0) {
      this.patientForm.setControl('metabolic_test', this.set_Metabolic(this.patientData['metabolic_test']));
    }

    this.patientForm.patchValue({
      glucose_level: this.patientData.glucose_level,
      additional_comment: this.patientData.additional_comment,
      is_diabetic: this.patientData.is_diabetic,
      is_smoke: this.patientData.is_smoke,
      frequency_of_alchol: this.patientData.frequency_of_alchol
    });

  }

  get blood_test() {
    return this.patientForm.get('blood_test') as FormArray;
  }

  get metabolic_test() {
    return this.patientForm.get('metabolic_test') as FormArray;
  }

  addBlood() {
    this.bloodNum++;
    this.blood_test.push(this._fb.group({
      key: [],
      range: [],
      value: []
    }));
  }

  removeBlood(i) {
    this.bloodNum--;
    this.blood_test.removeAt(i);
  }

  set_bloodTest(data): FormArray {
    const formArray = new FormArray([]);

    data.forEach(element => {
      formArray.push(this._fb.group({
        key: {
          highDesc: element.highDesc,
          key: element.key,
          lowDesc: element.lowDesc,
          range: element.range,
          value: ""
        },
        // range: element.range,
        value: element.value,
      }));
    });

    return formArray;
  }

  addMetabolic() {
    this.metabolicNum++;
    this.metabolic_test.push(this._fb.group({
      key: [],
      range: [],
      value: []
    }));
  }

  removeMetabolic(i) {
    this.metabolicNum--;
    this.metabolic_test.removeAt(i);
  }

  set_Metabolic(data): FormArray {
    const formArray = new FormArray([]);

    data.forEach(element => {
      formArray.push(this._fb.group({
        key: {
          highDesc: element.highDesc,
          key: element.key,
          lowDesc: element.lowDesc,
          range: element.range,
          value: ""
        },
        value: element.value,
      }));
    });

    console.log(formArray.value);

    return formArray;
  }

  onUpdate() {
    return this.patientForm.value;
  }

}
