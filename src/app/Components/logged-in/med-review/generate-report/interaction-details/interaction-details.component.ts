import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { GenerateReportComponent } from '../generate-report.component';

@Component({
  selector: 'app-interaction-details',
  templateUrl: './interaction-details.component.html',
  styleUrls: ['./interaction-details.component.css']
})
export class InteractionDetailsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<GenerateReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    // console.group(this.data)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
