import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { ReportsService } from 'src/app/Services/reports.service';
import { PatientService } from 'src/app/Services/patient.service';
import { SearchService } from 'src/app/Services/search.service';

@Component({
  selector: 'app-indications',
  templateUrl: './indications.component.html',
  styleUrls: ['./indications.component.css', '../review-reports.component.css']
})
export class IndicationsComponent implements OnInit {

  patientForm: FormGroup;
  common_diseses = {
    common_indications: '',
    common_classes: '',
    common_drugs: '',
    // drug: '',
  };
  extraDrug;
  common_indicationList;
  common_classesList;
  common_drugsList;
  search_int_med;
  int_med_list = [];
  selected_indication;
  indicationList = [];
  selected_med;
  drugList = [];
  search_cond;
  indicationFilter_list = [];
  search_med;
  medFilter_list = [];
  show_more = false;

  @Input() patientData;

  constructor(private reportService: ReportsService, private patientService: PatientService, private _fb: FormBuilder,
    private ngxLoader: NgxUiLoaderService, private searchService: SearchService) {

    this.patientForm = this._fb.group({
      common_prescription: this._fb.array([]),
      medication_history: this._fb.array([]),
      question_ans: this._fb.array([]),
      extra_drug: this._fb.array([]),
      extra_question: this._fb.array([])
    });
  }

  ngOnInit() {

    this.reportService.getCommonInfo().subscribe(res => {
      this.common_indicationList = res;
    });

    this.getIndication();

    if (this.patientData['common_prescription'].length != 0)
      this.patientForm.setControl('common_prescription', this.set_prescription(this.patientData['common_prescription']));
    if (this.patientData['medication_history'].length != 0)
      this.patientForm.setControl('medication_history', this.set_medication(this.patientData['medication_history']));
    if (this.patientData['question_ans'].length != 0)
      this.patientForm.setControl('question_ans', this.set_questions(this.patientData['question_ans']));
    if (this.patientData['extra_drug'].length != 0)
      this.patientForm.setControl('extra_drug', this.set_extra_drug(this.patientData['extra_drug']));
    if (this.patientData['extra_question'].length != 0)
      this.patientForm.setControl('extra_question', this.set_questions(this.patientData['extra_question']));

  }

  trackByIdentity = (index: number, item: any) => item._id;

  // get all indications
  getIndication() {
    this.patientService.getAllIndication({ indication_list: true }).subscribe(
      res => {
        res.shift();
        this.indicationList = this.indicationList.concat(res);
        this.indicationFilters('');
      }
    );
  }

  onselectDisease(event) {
    if (event == false) {
      this.common_classesList = this.common_diseses.common_indications['value'];
    }
  }

  onselectClasses(event) {
    if (event == false) {
      this.common_drugsList = this.common_diseses.common_classes['value'];
    }
  }

  get common_prescription() {
    return this.patientForm.get('common_prescription') as FormArray;
  }

  add_prescription() {
    this.common_prescription.push(this._fb.group({
      common_indications: this.common_diseses.common_indications,
      common_classes: this.common_diseses.common_classes,
      common_drugs: this.common_diseses.common_drugs,
      // drug: this.common_diseses.drug,
      directions: [''],
      prescriber: [''],
    }));
  }

  remove_prescription(i) {
    this.common_prescription.removeAt(i);
  }

  set_prescription(data): FormArray {
    const formArray = new FormArray([]);

    data.forEach(element => {
      formArray.push(this._fb.group({
        common_indications: element.common_indications,
        common_classes: element.common_classes,
        common_drugs: element.common_drugs,
        drug: element.drug,
        directions: element.directions,
        prescriber: element.prescriber
      }))
    });

    return formArray;
  }

  //extra drugs......
  get extra_drug() {
    return this.patientForm.get('extra_drug') as FormArray;
  }

  add_extraDrug() {
    this.extra_drug.push(
      this._fb.group({
        drug: this.extraDrug,
        condition: '',
        directions: '',
        other_indication: '',
        comments: '',
        prescriber: '',
      })
    );

    console.log(this.extraDrug)

    let index = this.extra_question.value.findIndex(v => v['question'] === this.extraDrug.food_interaction_questions);
    if (index == -1 && this.extraDrug.food_interaction_questions) {
      this.add_extra_question(this.extraDrug.food_interaction_questions, this.extraDrug.brand_name, this.extraDrug.notes);
      return
    }

    this.search_int_med = '';
    this.extraDrug = '';
  }

  remove_extraDrug(i) {
    this.extra_drug.removeAt(i);
  }

  set_extra_drug(data): FormArray {
    const formArray = new FormArray([]);

    data.forEach(element => {
      formArray.push(this._fb.group({
        drug: element.drug,
        condition: element.condition,
        directions: element.directions,
        other_indication: element.other_indication,
        comments: element.comments,
        prescriber: element.prescriber
      }))
    });

    return formArray;
  }

  //Extra Questions......
  get extra_question() {
    return this.patientForm.get('extra_question') as FormArray;
  }

  add_extra_question(question, brand_name, notes) {
    this.extra_question.push(
      this._fb.group({
        drug: brand_name,
        question: question,
        notes: notes,
        comments: '',
        answer: ''
      })
    );
  }

  remove_extra_question(i) {
    this.extra_question.removeAt(i);
  }

  set_extra_questions(data): FormArray {
    const formArray = new FormArray([]);

    data.forEach(element => {
      formArray.push(this._fb.group({
        drug: element.drug,
        question: element.question,
        notes: element.notes,
        comments: element.comments,
        answer: element.answer
      }))
    });

    return formArray;
  }


  // medication
  get medication_history() {
    return this.patientForm.get('medication_history') as FormArray;
  }

  add_medication() {
    this.medication_history.push(
      this._fb.group({
        // pre_existing_conditions: this.selected_indication,
        drug: this.selected_med,
        directions: '',
        condition: this.selected_indication.indication,
        other_indication: '',
        comments: '',
        prescriber: '',
      })
    );

    let index = this.question_ans.value.findIndex(v => v['question'] === this.selected_med.food_interaction_questions);
    if (index == -1 && this.selected_med.food_interaction_questions) {
      this.add_question(this.selected_med.food_interaction_questions, this.selected_med.brand_name, this.selected_med.notes);
      return;
    }

    this.selected_indication = '';
    this.selected_med = '';
  }

  remove_medication(i) {
    this.medication_history.removeAt(i);
  }

  set_medication(data): FormArray {
    const formArray = new FormArray([]);

    data.forEach(element => {
      formArray.push(this._fb.group({
        // pre_existing_conditions: element.pre_existing_conditions,
        condition: element.condition,
        drug: element.drug,
        directions: element.directions,
        other_indication: element.other_indication,
        comments: element.comments,
        prescriber: element.prescriber
      }))
    });

    return formArray;
  }

  //Question answer
  get question_ans() {
    return this.patientForm.get('question_ans') as FormArray;
  }

  add_question(question, brand_name, notes) {
    this.question_ans.push(
      this._fb.group({
        drug: brand_name,
        question: question,
        notes: notes,
        comments: '',
        answer: ''
      })
    );
  }

  remove_question(i) {
    this.question_ans.removeAt(i);
  }

  set_questions(data): FormArray {
    const formArray = new FormArray([]);

    data.forEach(element => {
      formArray.push(this._fb.group({
        drug: element.drug,
        question: element.question,
        notes: element.notes,
        comments: element.comments,
        answer: element.answer
      }))
    });

    return formArray;
  }

  getDrug() {
    let data = {
      search: this.search_int_med
    };
    if (this.search_int_med.length > 2) {
      this.ngxLoader.startBackground();
      this.searchService.brandSearch(data).subscribe(res => {
        this.int_med_list = res;
        this.ngxLoader.stopBackground();
      });
    }
  }

  // indication search filter
  indicationFilters(filterString: String) {

    if (this.indicationList.length === 0 || filterString == '') {
      this.indicationFilter_list = this.indicationList;
    } else {
      let resultArray = [];

      for (const item of this.indicationList) {

        let searchItem: string = item['indication'];

        if (searchItem.toLowerCase().includes(filterString.toLowerCase())) {
          // console.log(item)
          resultArray.push(item);
        }
      }

      this.indicationFilter_list = resultArray;
    }
  }

  // get Medication per condition
  onselectConditions(event) {
    if (event == false) {
      this.search_cond = '';
      this.indicationFilters('');

      if (this.selected_indication) {
        let id = {
          indication_id: this.selected_indication['_id']
        };

        this.ngxLoader.startBackground();
        this.patientService.getDrugForEachIndication(id).subscribe(
          res => {
            this.drugList = res;
            this.medFilters('');
            this.ngxLoader.stopBackground();
          }
        );
      }
    }
  }

  medFilters(filterString: string) {
    if (this.drugList.length === 0 || filterString == '') {
      this.medFilter_list = this.drugList;
    } else {
      let resultArray = [];
      for (const item of this.drugList) {
        let searchItem: string = item['brand_name'];
        let ndcItem: string = item['ndc'];
        let genericItem = item['generic_name'];
        if (searchItem.toLowerCase().includes(filterString.toLowerCase()) ||
          ndcItem.toLowerCase().includes(filterString.toLowerCase()) || genericItem.toLowerCase().includes(filterString.toLowerCase())) {
          // console.log(item)
          resultArray.push(item);
        }
      }
      this.medFilter_list = resultArray;
    }

  }

  resetMedFilter() {
    this.medFilters('');
    this.search_med = '';
  }

  onUpdate() {
    return this.patientForm.value;
  }

}
