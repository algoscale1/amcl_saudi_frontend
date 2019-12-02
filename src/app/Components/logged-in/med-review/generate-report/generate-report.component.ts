import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { PatientService } from 'src/app/Services/patient.service';
import { SubstitutesComponent } from './substitutes/substitutes.component';
import { SubstitutionService } from 'src/app/Services/substitution.service';
import { SearchService } from 'src/app/Services/search.service';
import { DrugDetailsComponent } from './drug-details/drug-details.component';
import { InteractionDetailsComponent } from './interaction-details/interaction-details.component';
// import { OtcDetailsComponent } from './otc-details/otc-details.component';
import { ReportsService } from 'src/app/Services/reports.service';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.css']
})
export class GenerateReportComponent implements OnInit, AfterViewInit {
  edit: Boolean = false;
  patientId;
  reportId;
  patientInfo;
  basicInfo;
  interactions;
  test_blood = [];
  test_metabolic = [];
  mpr_graph = [];
  pdc_graph = [];
  glucose_value;
  glucose_level;
  glucose_level_means = '';
  diabetic_do = '';
  displayedColumns: string[] = ['NDC', 'name', 'manufacturer', 'dosage', 'cost', 'condition', 'directions', 'prescriber'];
  drugColumns: string[] = ['drugs', 'substitute', 'comments', 'action'];
  med_list = [];
  // med_list_int = [];
  mprList: any;
  pdcList: any;
  marsList = [];
  result1: any;
  result2: any
  result3: any;
  comment: any;
  all_indication: any;
  all_questions: any;
  management: any;
  // int_list = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private reportService: ReportsService, private route: ActivatedRoute, private ngxLoader: NgxUiLoaderService,
    public dialog: MatDialog, private substituteService: SubstitutionService, private searchService: SearchService
  ) { }

  ngOnInit() {

    this.patientId = this.route.snapshot.paramMap.get('id');
    this.reportId = this.route.snapshot.paramMap.get('report_id');

    this.ngxLoader.start();

    this.reportService.getReportData(this.patientId, this.reportId).subscribe(
      res => {
        this.ngxLoader.stop();

        this.basicInfo = res['basicInfo'];
        this.patientInfo = res['reports'];
        this.interactions = res['interaction'];
        console.log('explanation here..', res['interaction'])
        this.glucose_value = parseFloat(this.patientInfo['glucose_level']);
        console.log(this.patientInfo);
        this.mprList = this.patientInfo['mpr'];
        this.pdcList = this.patientInfo['pdc'];
        this.marsList = this.patientInfo['mars'];
        this.all_indication = this.patientInfo.extra_drug.concat(this.patientInfo.medication_history);
        this.all_questions = this.patientInfo.extra_question.concat(this.patientInfo.question_ans);
        console.log(this.all_indication);
        // console.log(this.all_questions);

        if (this.marsList.length != 0) {
          if ((this.marsList[0]['answer'] === 'no') && (this.marsList[1]['answer'] === 'no') && (this.marsList[2]['answer'] === 'no') && (this.marsList[3]['answer'] === 'no') &&
            (this.marsList[4]['answer'] === 'no') && (this.marsList[5]['answer'] === 'no') && (this.marsList[6]['answer'] === 'yes') && (this.marsList[7]['answer'] === 'yes') &&
            (this.marsList[8]['answer'] === 'no') && (this.marsList[9]['answer'] === 'no')) {

            this.comment = 'Full Compliance as per MARS test results'
          }
          else {
            this.comment = 'No Compliance as per MARS test results'
          }
        }


        this.med_list = this.patientInfo['medication_history'].map(v => v['drug']);
        this.med_list = this.med_list.concat(this.patientInfo['extra_drug'].map(v => v['drug']));
        // this.med_list_int = this.patientInfo['medication_history'].map(v => v['drug']);
        // this.med_list_int = this.med_list_int.concat(this.patientInfo['extra_drug'].map(v => v['drug']));
        // console.log(this.med_list_int)

        if (this.patientInfo['blood_test'] != []) {
          this.patientInfo['blood_test'].forEach(element => {

            let range: string = element.range;

            let min_value = parseFloat(range.split('-', 2)[0]);
            let max_value = parseFloat(range.split('-', 2)[1]);

            let low_max = min_value + (max_value - min_value) / 3;
            let mod_max = max_value - (max_value - min_value) / 3;

            let description = '';

            if (element.value < low_max) {
              description = element.lowDesc;
            }
            else if (element.value > mod_max) {
              description = element.highDesc;
            }
            // else {
            //   description = 'No comments';
            // }

            this.test_blood.push({
              "chart": {
                "theme": "fusion",
                "caption": element.key,
                "lowerLimit": range.split('-', 2)[0],
                "upperLimit": range.split('-', 2)[1],
                // "numberSuffix": "%",
                "privious_score": element.privious_score,
                "description": description,
                "chartBottomMargin": "20",
                "valueFontSize": "11",
                "valueFontBold": "0"
              },
              // Gauge Data
              "colorRange": {
                "color": [{
                  "minValue": min_value,
                  "maxValue": low_max,
                  "label": "Low",
                },
                {
                  "minValue": low_max,
                  "maxValue": mod_max,
                  "label": "Moderate",
                },
                {
                  "minValue": mod_max,
                  "maxValue": max_value,
                  "label": "High",
                }
                ]
              },
              "pointers": {
                "pointer": [{
                  "value": element.value
                }]
              },
              "annotations": {
                "origw": "400",
                "origh": "190",
                "autoscale": "1",
                "groups": [{
                  "id": "range",
                  "items": [{
                    "id": "rangeBg",
                    "type": "rectangle",
                    "x": "$chartCenterX-115",
                    "y": "$chartEndY-35",
                    "tox": "$chartCenterX +115",
                    "toy": "$chartEndY-15",
                    "fillcolor": "#0075c2"
                  },
                  ]
                }]
              }
            });

          });

        }

        if (this.patientInfo['mpr'] != []) {

          this.patientInfo['mpr'].map(element => {

            this.mpr_graph.push({
              "chart": {
                "theme": "fusion",
                "caption": element.med,
                "lowerLimit": 0,
                "upperLimit": 100,
                // "numberSuffix": "%",
                // "privious_score": element.privious_score,
                // "description": description,
                "chartBottomMargin": "20",
                "valueFontSize": "11",
                "valueFontBold": "0"
              },
              // Gauge Data
              "colorRange": {
                "color": [{
                  "minValue": 0,
                  "maxValue": 40,
                  "label": "Low",
                },
                {
                  "minValue": 40,
                  "maxValue": 80,
                  "label": "Moderate",
                },
                {
                  "minValue": 80,
                  "maxValue": 100,
                  "label": "High",
                }
                ]
              },
              "pointers": {
                "pointer": [{
                  "value": element.result
                }]
              },
              "annotations": {
                "origw": "400",
                "origh": "190",
                "autoscale": "1",
                "groups": [{
                  "id": "range",
                  "items": [{
                    "id": "rangeBg",
                    "type": "rectangle",
                    "x": "$chartCenterX-115",
                    "y": "$chartEndY-35",
                    "tox": "$chartCenterX +115",
                    "toy": "$chartEndY-15",
                    "fillcolor": "#0075c2"
                  },
                  ]
                }]
              }
            });
          })

        }

        if (this.patientInfo['pdc'] != []) {

          this.patientInfo['pdc'].map(element => {

            this.pdc_graph.push({
              "chart": {
                "theme": "fusion",
                "caption": element.med,
                "lowerLimit": 0,
                "upperLimit": 100,
                // "numberSuffix": "%",
                // "privious_score": element.privious_score,
                // "description": description,
                "chartBottomMargin": "20",
                "valueFontSize": "11",
                "valueFontBold": "0"
              },
              // Gauge Data
              "colorRange": {
                "color": [{
                  "minValue": 0,
                  "maxValue": 40,
                  "label": "Low",
                },
                {
                  "minValue": 40,
                  "maxValue": 80,
                  "label": "Moderate",
                },
                {
                  "minValue": 80,
                  "maxValue": 100,
                  "label": "High",
                }
                ]
              },
              "pointers": {
                "pointer": [{
                  "value": element.result
                }]
              },
              "annotations": {
                "origw": "400",
                "origh": "190",
                "autoscale": "1",
                "groups": [{
                  "id": "range",
                  "items": [{
                    "id": "rangeBg",
                    "type": "rectangle",
                    "x": "$chartCenterX-115",
                    "y": "$chartEndY-35",
                    "tox": "$chartCenterX +115",
                    "toy": "$chartEndY-15",
                    "fillcolor": "#0075c2"
                  },
                  ]
                }]
              }
            });
          })

        }

        if (this.patientInfo['metabolic_test'] != []) {
          this.patientInfo['metabolic_test'].forEach(element => {

            let range: string = element.range;

            let min_value = parseFloat(range.split('-', 2)[0]);
            let max_value = parseFloat(range.split('-', 2)[1]);

            let low_max = min_value + (max_value - min_value) / 3;
            let mod_max = max_value - (max_value - min_value) / 3;

            let description = '';

            if (element.value < low_max) {
              description = element.lowDesc;
            }
            else if (element.value > mod_max) {
              description = element.highDesc;
            }
            // else {
            //   description = 'No comments';
            // }

            this.test_metabolic.push({
              "chart": {
                "theme": "fusion",
                "caption": element.key,
                "lowerLimit": range.split('-', 2)[0],
                "upperLimit": range.split('-', 2)[1],
                // "numberSuffix": "%",
                "privious_score": element.privious_score,
                "description": description,
                "chartBottomMargin": "20",
                "valueFontSize": "11",
                "valueFontBold": "0"
              },
              // Gauge Data
              "colorRange": {
                "color": [{
                  "minValue": min_value,
                  "maxValue": low_max,
                  "label": "Low",
                },
                {
                  "minValue": low_max,
                  "maxValue": mod_max,
                  "label": "Moderate",
                },
                {
                  "minValue": mod_max,
                  "maxValue": max_value,
                  "label": "High",
                }
                ]
              },
              "pointers": {
                "pointer": [{
                  "value": element.value
                }]
              },
              "annotations": {
                "origw": "400",
                "origh": "190",
                "autoscale": "1",
                "groups": [{
                  "id": "range",
                  "items": [{
                    "id": "rangeBg",
                    "type": "rectangle",
                    "x": "$chartCenterX-115",
                    "y": "$chartEndY-35",
                    "tox": "$chartCenterX +115",
                    "toy": "$chartEndY-15",
                    "fillcolor": "#0075c2"
                  },
                  ]
                }]
              }
            });

          });
        }

        if (this.patientInfo['glucose_level'] != '') {
          this.glucose_level = {
            "chart": {
              "theme": "fusion",
              "caption": "Glucose Level",
              "lowerLimit": 60,
              "upperLimit": 100,
              // "numberSuffix": "%",
              "chartBottomMargin": "20",
              "valueFontSize": "11",
              "valueFontBold": "0"
            },
            // Gauge Data
            "colorRange": {
              "color": [
                {
                  "minValue": 60,
                  "maxValue": 75,
                  "label": "Low",
                },
                {
                  "minValue": 75,
                  "maxValue": 90,
                  "label": "Moderate",
                },
                {
                  "minValue": 90,
                  "maxValue": 100,
                  "label": "High",
                }
              ]
            },
            "pointers": {
              "pointer": [{
                "value": this.glucose_value
              }]
            },
            "annotations": {
              "origw": "400",
              "origh": "190",
              "autoscale": "1",
              "groups": [{
                "id": "range",
                "items": [{
                  "id": "rangeBg",
                  "type": "rectangle",
                  "x": "$chartCenterX-115",
                  "y": "$chartEndY-35",
                  "tox": "$chartCenterX +115",
                  "toy": "$chartEndY-15",
                  "fillcolor": "#0075c2"
                },
                ]
              }]
            }
          };
        }

        if (this.glucose_value <= 60) {
          this.glucose_level_means = 'Hypoglycemic(Low blood glucose)';
          this.diabetic_do = 'Eat food with 5-10 grams fast acting carbohydrate';
        } else if (this.glucose_value > 60 && this.glucose_value <= 80) {
          this.glucose_level_means = 'Below Normal';
          this.diabetic_do = 'Eat food with 5 grams carbohydrate';
        } else if (this.glucose_value > 80 && this.glucose_value <= 100) {
          this.glucose_level_means = 'Normal';
          this.diabetic_do = 'Do Nothing';
        } else if (this.glucose_value > 100 && this.glucose_value <= 120) {
          this.glucose_level_means = 'Above Normal';
          this.diabetic_do = 'Excercise or take insulin';
        } else if (this.glucose_value > 120) {
          this.glucose_level_means = 'Hyperglycemic(High blood glucose)';
          this.diabetic_do = 'Take insulin';
        }
      }
    );
  }

  ngAfterViewInit() {
    // this.med_list.paginator = this.paginator;
    // this.med_list.sort = this.sort;
  }

  findSubstitute(new_med, index) {

    let substitute_id = this.med_list.map(res => res['_id']);

    let param = {
      new_drug: new_med,
      old_drugs: substitute_id,
    };

    this.ngxLoader.startBackground();

    this.substituteService.substituteResult(param).subscribe(
      res => {
        this.ngxLoader.stopBackground();

        const dialogRef = this.dialog.open(SubstitutesComponent, {
          width: '600px',
          data: res['subtitute']
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.med_list[index]['substitute'] = result.brand_name;
            console.log(this.med_list);

            // this.med_list_int[index] = result;
            // console.log(this.med_list);
          }
        });

      }
    );

  }

  removeSubstitute(index) {
    this.med_list[index]['substitute'] = '';
  }

  fetchDetails(id) {

    let data = {
      extra_info_id: id
    }

    this.ngxLoader.startBackground();

    this.searchService.brandSearch(data).subscribe(res => {
      this.ngxLoader.stopBackground();

      this.dialog.open(DrugDetailsComponent, {
        width: '600px',
        data: res[0]
      });

    })
  }

  intDetail(drug1, drug2) {

    let data = {
      extra_info_id: [drug1, drug2]
    }

    this.ngxLoader.startBackground();

    this.searchService.brandSearch(data).subscribe(res => {
      this.ngxLoader.stopBackground();

      this.dialog.open(InteractionDetailsComponent, {
        width: '600px',
        data: res
      });

    })

  }

  otcDetails(id) {

    this.ngxLoader.startBackground();

    this.searchService.otcDetails(id).subscribe(res => {
      console.log(res);
      this.ngxLoader.stopBackground();

      // this.dialog.open(OtcDetailsComponent, {
      //   width: '600px',
      //   data: res
      // });

    });

  }

  print() {
    window.print();
  }
  editExpalnation(exp, id) {
    this.management = exp;
    debugger
    this.edit = !this.edit;

  }
  isAllowed = (optional) => {
    return optional === 0 ? true : this.edit;
  }

}
