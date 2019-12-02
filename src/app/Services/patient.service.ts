import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private http: HttpClient) { }

  addPatient(data) {

    return this.http.post(`${environment.API_url}/patient/create`, data).pipe(
      map(res => true),
      catchError((err) => {
        return throwError(err.error);
      })
    )
  }

  getPatientList(formVAlue) {

    return this.http.get(`${environment.API_url}/patient/get`).pipe(
      map(res => res['data'])
    )
  }

  getPatientSearch(formVAlue) {

    return this.http.get(`${environment.API_url}/patient/get?search=${formVAlue.search}`).pipe(
      map(res => res['data'])
    )
  }

  getDob(formVAlue) {
    if (formVAlue.dob) {
      formVAlue.dob = new Date(formVAlue.dob).toISOString();
    }
    return this.http.get(`${environment.API_url}/patient/get?dob=${formVAlue.dob}`).pipe(
      map(res => res['data'])
    )
  }

  getPatient(id) {
    return this.http.get(`${environment.API_url}/patient/get/${id}`).pipe(
      map(res => res['data'])
    )
  }

  updatePatient(id, data) {

    return this.http.patch(`${environment.API_url}/patient/update/${id}`, data).pipe(
      map(res => res['message'])
    )
  }

  deletePatient(id) {

    return this.http.delete(`${environment.API_url}/patient/delete/${id}`).pipe(
      map(res => res['message'])
    )
  }

  getAllIndication(params?) {

    return this.http.get(`${environment.API_url}/drug/indication/get/`, { params: params }).pipe(
      map(res => res['data'])
    )
  }

  getDrugForEachIndication(data?) {

    return this.http.get(`${environment.API_url}/drug/indication/get`, { params: data }).pipe(
      map(res => res['data'])
    )
  }

  getAllMedication() {

    return this.http.get(`${environment.API_url}/drug/get`).pipe(
      map(res => res['data'])
    )
  }

  getBloodTest() {

    return this.http.get(`${environment.API_url}/drug/bloodTest/list`).pipe(
      map(res => res['data'])
    )
  }

  getMetabolicTest() {

    return this.http.get(`${environment.API_url}/drug/metabolicTest/list`).pipe(
      map(res => res['data'])
    )
  }

  generateReport(id) {
    return this.http.get(`${environment.API_url}/patient/get/${id}?report=true`).pipe(
      map(res => res['data'])
    )
  }

  getPatientData(id) {
    return this.http.get(`${environment.API_url}/patient/get/${id}`).pipe(
      map(res => res['data'])
    )
  }

  getTableData() {
    return this.http.get(`${environment.API_url}/drug/getTable`).pipe(
      map(res => res['data'])
    )
  }

}
