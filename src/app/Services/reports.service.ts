import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient) { }

  createReport(data) {
    return this.http.post(`${environment.API_url}/patient/report/create`, data).pipe(
      map(res => res['data']),
      catchError((err) => {
        return throwError(err.error);
      })
    );
  }

  getReport(patient_id, report_id) {

    return this.http.get(`${environment.API_url}/patient/report/get/${patient_id}/${report_id}`).pipe(
      map(res => res['data']),
      catchError((err) => {
        return throwError(err.error);
      })
    );
  }

  updateReport(patient_id, report_id, data) {
    return this.http.patch(`${environment.API_url}/patient/report/update/${patient_id}/${report_id}`, data).pipe(
      map(res => res['data']),
      catchError((err) => {
        return throwError(err.error);
      })
    );
  }

  deleteReport(patient_id, report_id) {

    return this.http.delete(`${environment.API_url}/patient/report/delete/${patient_id}/${report_id}`).pipe(
      map(res => res),
      catchError((err) => {
        return throwError(err.error);
      })
    );
  }

  getReportData(patient_id, report_id) {
    return this.http.get(`${environment.API_url}/patient/report/get/${patient_id}/${report_id}?report=true`).pipe(
      map(res => res['data']),
      catchError((err) => {
        return throwError(err.error);
      })
    );
  }

  getCommonInfo() {
    return this.http.get(`${environment.API_url}/drug/commonInfo/list`).pipe(
      map(res => res['data']),
      catchError((err) => {
        return throwError(err.error);
      })
    );
  }
  getDrugs(params?) {
    return this.http.get(`${environment.API_url}/drug/getDrugUses`, { params: params }).pipe(
      map(res => res['data']),
      catchError((err) => {
        return throwError(err.error);
      })
    );

  }
}
