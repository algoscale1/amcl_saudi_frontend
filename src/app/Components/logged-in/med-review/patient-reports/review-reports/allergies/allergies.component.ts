import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-allergies',
  templateUrl: './allergies.component.html',
  styleUrls: ['./allergies.component.css', '../review-reports.component.css']
})
export class AllergiesComponent implements OnInit {

  patientForm: FormGroup;
  reportedReactions = [
    'Anaphylactic',
    'Hives or Itching',
    'Numbness or Weakness',
    'Throat Pain or Swelling',
    'Dizziness',
    'Muscle Pain or Stiffness',
    'Rash or Redness',
    'Trouble Breathing or Pain',
    'Fever',
    'Nasal Discharge',
    'Shortness of Breath',
    'Headache',
    'Nausea or Vomiting',
    'Swelling'];

  @Input() patientData;

  constructor(private _fb: FormBuilder) {

    this.patientForm = this._fb.group({
      allergies: '',
      reactions: [],
      other_reactions: ''
    });

  }

  ngOnInit() {
    this.patientForm.patchValue(this.patientData);
  }

  onUpdate() {
    return this.patientForm.value;
  }

}
