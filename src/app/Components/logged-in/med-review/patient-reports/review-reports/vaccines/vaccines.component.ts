import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-vaccines',
  templateUrl: './vaccines.component.html',
  styleUrls: ['./vaccines.component.css', '../review-reports.component.css']
})
export class VaccinesComponent implements OnInit {

  patientForm: FormGroup;
  cypTest = ['Yes', 'No', 'N/A'];
  vaccines = [
    'Influenza Vaccine',
    'Pneumococcal Vaccine',
    'Herpes Zoster (Shingles) Vaccine',
    'MMR Vaccine', 'Tdap Vaccine',
    'Hepatits A/B: Optional',
    'None'
  ];
  reportedConcern = ['Overactive bladder', 'Insomnia', 'Appetite Loss', 'Mood Disorders or Depression', 'Nightmares', 'None'];

  @Input() patientData;

  constructor(private _fb: FormBuilder) {

    this.patientForm = this._fb.group({
      cyp_genetic_test: '',
      vaccines: [],
      self_reported_concerns: [],
      additional_treatment: ''
    });

  }

  ngOnInit() {

    this.patientForm.patchValue(this.patientData);
  }

  onUpdate() {
    return this.patientForm.value;
  }

}
