import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { ReportsService } from 'src/app/Services/reports.service';
import { IndicationsComponent } from './indications/indications.component';
import { OtcMedComponent } from './otc-med/otc-med.component';
import { VaccinesComponent } from './vaccines/vaccines.component';
import { AllergiesComponent } from './allergies/allergies.component';
import { AdheranceComponent } from './adherance/adherance.component';
import { DietLifestyleComponent } from './diet-lifestyle/diet-lifestyle.component';
import { DrugDetailsComponent } from '../../generate-report/drug-details/drug-details.component';
import { GeneralInfoComponent } from './general-info/general-info.component';

@Component({
  selector: 'app-review-reports',
  templateUrl: './review-reports.component.html',
  styleUrls: ['./review-reports.component.css']
})
export class ReviewReportsComponent implements OnInit {

  patient_id;
  report_id;
  patientData;
  infoData = {};
  indicationData = {};
  otcData = {};
  vaccinesData = {};
  allergyData = {};
  adheranceData = {};
  lifestyleData = {};
  allMed = [];

  @ViewChild(GeneralInfoComponent) info: GeneralInfoComponent;
  @ViewChild(IndicationsComponent) indication: IndicationsComponent;
  @ViewChild(OtcMedComponent) otc: OtcMedComponent;
  @ViewChild(VaccinesComponent) vaccines: VaccinesComponent;
  @ViewChild(AllergiesComponent) allergy: AllergiesComponent;
  @ViewChild(AdheranceComponent) adherance: AdheranceComponent;
  @ViewChild(DietLifestyleComponent) lifestyle: DietLifestyleComponent;

  constructor(private reportService: ReportsService, private route: ActivatedRoute, private ngxLoader: NgxUiLoaderService, private snackBar: MatSnackBar, private router: Router) {

    this.patient_id = this.route.snapshot.paramMap.get('id');
    this.report_id = this.route.snapshot.paramMap.get('report_id');

    this.ngxLoader.start();
    this.getReportData();

  }

  ngOnInit() {
  }

  getReportData() {
    this.reportService.getReport(this.patient_id, this.report_id).subscribe(
      res => {
        this.ngxLoader.stop();
        this.patientData = res['reports'];

        this.infoData = res._id;

        Object.assign(this.indicationData, {
          common_prescription: this.patientData.common_prescription,
          extra_drug: this.patientData.extra_drug,
          medication_history: this.patientData.medication_history,
          question_ans: this.patientData.question_ans,
          extra_question: this.patientData.extra_question
        });

        Object.assign(this.otcData, {
          otc_drugs_history: this.patientData['otc_drugs_history']
        });

        Object.assign(this.vaccinesData, {
          cyp_genetic_test: this.patientData['cyp_genetic_test'],
          vaccines: this.patientData['vaccines'],
          self_reported_concerns: this.patientData['self_reported_concerns'],
          additional_treatment: this.patientData['additional_treatment']
        });

        Object.assign(this.allergyData, {
          allergies: this.patientData['allergies'],
          reactions: this.patientData['reactions'],
          other_reactions: this.patientData['other_reactions']
        });

        Object.assign(this.adheranceData, {
          mpr: this.patientData['mpr'],
          pdc: this.patientData['pdc'],
          recently_hospitalized: this.patientData['recently_hospitalized'],
          adherence_notes: this.patientData['adherence_notes'],
          med_filled: this.patientData['med_filled'],
          adherance_med: this.patientData['adherance_med'],
          precription_not_taken: this.patientData['precription_not_taken']
        });

        this.allMed = this.patientData.medication_history.map(v => v['drug']);
        this.patientData.extra_drug.map(v => {
          if (v['drug'] != undefined) {
            this.allMed = this.allMed.concat(v['drug']);
          }
        });

        Object.assign(this.lifestyleData, {
          blood_test: this.patientData.blood_test,
          glucose_level: this.patientData.glucose_level,
          metabolic_test: this.patientData.metabolic_test,
          additional_comment: this.patientData.additional_comment,
          is_diabetic: this.patientData.is_diabetic,
          is_smoke: this.patientData.is_smoke,
          frequency_of_alchol: this.patientData.frequency_of_alchol
        });

        console.log('all data', res);
      }
    );

  }

  updateInfo() {
    //  console.log(this.infoData.name)

    this.info.onUpdate();
  }

  updateReport(data) {

    this.ngxLoader.startBackground();
    this.reportService.updateReport(this.patient_id, this.report_id, data).subscribe(
      res => {
        this.ngxLoader.stopBackground();
        this.snackBar.open('Patient Data updated', '', {
          duration: 2000
        });
      }
    );
  }

  onUpdateIndication() {
    let indications = this.indication.onUpdate();

    // indications['extra_drug'] = indications['extra_drug'].map(v => ({
    //   drug: v.drug._id,
    //   condition: v.condition,
    //   directions: v.directions,
    //   prescriber: v.prescriber
    // }));

    indications['medication_history'] = indications['medication_history'].map(v => ({
      // pre_existing_conditions: v.pre_existing_conditions._id,
      condition: v.condition,
      drug: v.drug._id,
      directions: v.directions,
      prescriber: v.prescriber,
    }));

    this.updateReport(indications);

    this.getReportData();

  }

  onUpdateOtc() {
    let otc = this.otc.onUpdate();

    otc['otc_drugs_history'] = otc['otc_drugs_history'].map(v => ({
      drug: v.drug._id,
      directions: v.directions,
      condition: v.condition,
      other_indication: v.other_indication,
      comments: v.comments,
      prescriber: v.prescriber,
    }));

    this.updateReport(otc);

    this.getReportData();

  }

  onUpdateVaccines() {
    let vaccine = this.vaccines.onUpdate();

    this.updateReport(vaccine);

    this.getReportData();

  }

  onUpdateAllergy() {
    let allergy = this.allergy.onUpdate();

    this.updateReport(allergy);

    this.getReportData();

  }

  onUpdateAdherance() {
    let adherance = this.adherance.onUpdate();

    this.updateReport(adherance);

    this.getReportData();

  }

  onUpdateLifestyle() {
    let diet = this.lifestyle.onUpdate();

    diet.blood_test = diet.blood_test.map((res, i) => {
      if (diet.blood_test[i].key != undefined) {
        return {
          key: res.key['key'],
          range: res.key['range'],
          lowDesc: res.key['lowDesc'],
          highDesc: res.key['highDesc'],
          value: res.value
        };
      }
    });

    diet.metabolic_test = diet.metabolic_test.map((res, i) => {
      if (diet.metabolic_test[i].key != undefined) {
        return {
          key: res.key['key'],
          range: res.key['range'],
          lowDesc: res.key['lowDesc'],
          highDesc: res.key['highDesc'],
          value: res.value
        };
      }
    });

    console.log(diet);

    this.updateReport(diet);

    this.router.navigate([`/reports/${this.patient_id}/${this.report_id}/generate_report`]);
  }

}
