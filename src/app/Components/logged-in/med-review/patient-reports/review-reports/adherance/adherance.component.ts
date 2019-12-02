import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { CautionComponent } from './caution/caution.component';

@Component({
  selector: 'app-adherance',
  templateUrl: './adherance.component.html',
  styleUrls: ['./adherance.component.css', '../review-reports.component.css']
})
export class AdheranceComponent implements OnInit {

  patientForm: FormGroup;
  mars = [
    { question: 'Do you ever forget to take your medication ?', answer: 'no' },
    { question: 'Are you careless at times at taking medication ?', answer: 'no' },
    { question: 'When you feel better do you sometimes stop taking medication ?', answer: 'no' },
    { question: 'Sometimes when you feel worse when you take medication so you stop taking it ?', answer: 'no' },
    { question: 'I take my medication when I am sick', answer: 'no' },
    { question: 'It is unnatural for my mind and body to be controlled my medication', answer: 'no' },
    { question: 'My thoughts are clearer on medication', answer: 'no' },
    { question: 'By staying on medication, I can prevent getting sick', answer: 'no' },
    { question: 'I feel weird, like a zombie, on medication ', answer: 'no' },
    { question: 'The medication makes me feel tired and sluggish', answer: 'no' },
  ];
  mars_toggle = false;
  option = ['Yes', 'No'];

  @Input() patientData;
  @Input() medData;

  constructor(private _fb: FormBuilder, public dialog: MatDialog) {

    this.patientForm = this._fb.group({
      mpr: this._fb.array([
        // this._fb.group({
        //   med: '',
        //   daysCovered: '',
        //   daysinPeriod: '',
        //   result: ''
        // })
      ]),
      pdc: this._fb.array([
        // this._fb.group({
        //   med: '',
        //   daysCovered: '',
        //   daysinPeriod: '',
        //   result: ''
        // })
      ]),
      recently_hospitalized: '',
      adherence_notes: '',
      med_filled: 'Yes',
      adherance_med: [],
      precription_not_taken: ''
    });
  }

  ngOnInit() {
    if (this.patientData['mpr'].length != 0) {
      this.patientForm.setControl('mpr', this.set_mpr(this.patientData['mpr']));
    }

    if (this.patientData['pdc'].length != 0) {
      this.patientForm.setControl('pdc', this.set_pdc(this.patientData['pdc']));
    }

    this.patientForm.patchValue({
      recently_hospitalized: this.patientData.recently_hospitalized,
      adherence_notes: this.patientData.adherence_notes,
      med_filled: this.patientData.med_filled,
      adherance_med: this.patientData.adherance_med.map(v => v['_id']),
      precription_not_taken: this.patientData.precription_not_taken
    });

    // this.mars = this.patientData.mars;
  }

  get mpr() {
    return this.patientForm.get('mpr') as FormArray;
  }

  get pdc() {
    return this.patientForm.get('pdc') as FormArray;
  }

  add_Mpr() {
    this.mpr.push(this._fb.group({
      med: '',
      daysCovered: '',
      daysinPeriod: '',
      result: ''
    }));
  }

  remove_Mpr(i) {
    this.mpr.removeAt(i);
  }

  set_mpr(data): FormArray {
    const formArray = new FormArray([]);

    data.forEach(element => {
      formArray.push(this._fb.group({
        med: element.med,
        daysCovered: element.daysCovered,
        daysinPeriod: element.daysinPeriod,
        result: element.result
      }));
    });

    return formArray;
  }

  add_Pdc() {
    this.pdc.push(this._fb.group({
      med: '',
      daysCovered: '',
      daysinPeriod: '',
      result: ''
    }));
  }

  remove_Pdc(i) {
    this.pdc.removeAt(i);
  }

  set_pdc(data): FormArray {
    const formArray = new FormArray([]);

    data.forEach(element => {
      formArray.push(this._fb.group({
        med: element.med,
        daysCovered: element.daysCovered,
        daysinPeriod: element.daysinPeriod,
        result: element.result
      }));
    });

    return formArray;
  }

  caution() {
    this.dialog.open(CautionComponent, { width: '500px' });
  }

  onUpdate() {
    let formData = this.patientForm.value;
    if (this.mars_toggle == true) {
      formData['mars'] = this.mars;
    } else {
      formData['mars'] = [];
    }

    return formData;
  }

}
