import { Component, OnInit } from '@angular/core';

import { PatientService } from 'src/app/Services/patient.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {

  patientList = [];
  fname = '';
  lname = '';

  constructor(private patientService: PatientService) { }

  ngOnInit() {

    this.patientService.getPatientList().subscribe(
      res => {
        this.patientList = res;

        for (let i = 0; i < this.patientList.length; i++) {
          let name: string = '';
          name = this.patientList[i]['name'];
          this.patientList[i]['fname'] = name.split(" ", 2)[0];
          this.patientList[i]['lname'] = name.split(" ", 2)[1];
        }

        // console.log(this.patientList)
      }
    );

  }

}
