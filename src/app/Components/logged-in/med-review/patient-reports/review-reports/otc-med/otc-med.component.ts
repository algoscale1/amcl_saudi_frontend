import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { SearchService } from 'src/app/Services/search.service';
import { PatientService } from 'src/app/Services/patient.service';
import { ReportsService } from 'src/app/Services/reports.service';

@Component({
  selector: 'app-otc-med',
  templateUrl: './otc-med.component.html',
  styleUrls: ['./otc-med.component.css', '../review-reports.component.css']
})
export class OtcMedComponent implements OnInit {

  patientForm: FormGroup;
  searchOtc;
  otcList = [];
  selectedOtc;
  search_cond;
  indicationList = [];
  indicationFilter_list = []

  @Input() patientData;

  constructor(private reportService: ReportsService, private patientService: PatientService, private searchService: SearchService,
    private ngxLoader: NgxUiLoaderService, private _fb: FormBuilder) {

    this.patientForm = this._fb.group({
      otc_drugs_history: this._fb.array([])
    })

  }

  ngOnInit() {

    this.patientService.getAllIndication({ indication_list: true }).subscribe(
      res => {
        // console.log(res)
        res.shift();
        this.indicationList = this.indicationList.concat(res);
        this.indicationFilters('');
      }
    );

    if (this.patientData['otc_drugs_history'].length != 0)
      this.patientForm.setControl('otc_drugs_history', this.set_otc(this.patientData['otc_drugs_history']));
  }

  get otc_drugs_history() {
    return this.patientForm.get('otc_drugs_history') as FormArray;
  }

  add_otc() {
    this.otc_drugs_history.push(this._fb.group({
      drug: this.selectedOtc,
      directions: '',
      condition: '',
      other_indication: '',
      comments: '',
      prescriber: '',
    }));
  }

  remove_otc(i) {
    this.otc_drugs_history.removeAt(i);
  }

  getOtcDrugs() {
    let data = {
      search: this.searchOtc
    };
    if (this.searchOtc.length > 2) {
      this.ngxLoader.startBackground();
      this.searchService.otcSearch(data).subscribe(res => {
        this.ngxLoader.stopBackground();
        this.otcList = res;
      });
    }
  }

  set_otc(data): FormArray {
    const formArray = new FormArray([]);

    data.forEach(element => {
      formArray.push(this._fb.group({
        drug: element.drug,
        directions: element.directions,
        condition: element.condition,
        other_indication: element.other_indication,
        comments: element.comments,
        prescriber: element.prescriber,
      }))
    });

    return formArray;
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

  onselectConditions(event) {
    if (event == false) {
      this.search_cond = '';
      this.indicationFilters('');
    }
  }

  onUpdate() {
    return this.patientForm.value;
  }

}
